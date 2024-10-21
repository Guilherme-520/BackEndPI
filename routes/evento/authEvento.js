const express = require('express');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const { TokenEventos, Cargo, UserEvento, Eventos } = require("../../model/db");

const router = express.Router();

// Registro de novo cargo em um evento para um usuário existente
// Registro de novo cargo em um evento para um usuário existente
router.post('/register/:nomeURL', async (req, res) => {
    const { nomeURL } = req.params; // Pega o nomeURL da URL
    const cargos = req.body.cargos; // Assume que idUserProfile é enviado no corpo da requisição

    if (!Array.isArray(cargos) || cargos.length === 0) {
        return res.status(400).json({ message: 'cargo must be a non-empty array' });
    }

    const validCargo = ['Avaliador', 'Editor Chefe', 'Convidado', 'Chair', 'Organizador', 'Autor', 'Ouvinte'];
    const invalidCargo = cargos.filter(cargo => !validCargo.includes(cargo));

    if (invalidCargo.length > 0) {
        return res.status(400).json({ message: `Invalid cargo: ${invalidCargo.join(', ')}` });
    }

    // Buscar o evento pelo nomeURL
    const evento = await Eventos.findOne({ where: { nomeURL } });
    if (!evento) {
        return res.status(404).json({ message: 'Evento not found' });
    }

    try {
        // Recuperar os cargos existentes do usuário para o evento
        let userEvento = await UserEvento.findOne({
            where: {
                idUserProfile: req.user.id, // Assume que o idUserProfile é fornecido no token anterior
                idEvento: evento.id
            }
        });

        // Se o registro não existir, cria um novo
        if (!userEvento) {
            userEvento = await UserEvento.create({
                idEvento: evento.id,
                idUserProfile: req.user.id,
                cargos: JSON.stringify(cargos) // Armazena os cargos como um array JSON
            });
        } else {
            // Atualiza os cargos existentes
            let existingCargos;
            try {
                existingCargos = JSON.parse(userEvento.cargos); // Tente analisar o JSON
            } catch (error) {
                console.error('Error parsing existing cargos, resetting to empty array:', error);
                existingCargos = []; // Se houver erro, redefina para um array vazio
            }

            const updatedCargos = Array.from(new Set([...existingCargos, ...cargos])); // Evita duplicatas
            userEvento.cargos = JSON.stringify(updatedCargos);
            await userEvento.save();
        }

        res.status(201).json({ message: 'User successfully registered for the event with new roles' });
    } catch (error) {
        console.error('Error registering user for event:', error);
        res.status(400).json({ message: 'Error registering user for event', error: error.message });
    }
});


// Login de usuário
router.post('/login/:nomeURL', async (req, res) => {
    const { nomeURL } = req.params;
    console.log("id do usuario é " + req.user.id);
    
    try {
        const idUserProfile = req.user.id;

        const evento = await Eventos.findOne({ where: { nomeURL } });
        if (!evento) {
            return res.status(404).json({ message: 'Evento not found' });
        }

        const userEvento = await UserEvento.findOne({
            where: { idUserProfile, idEvento: evento.id },
            include: [Eventos, Cargo]
        });

        if (!userEvento) {
            return res.status(400).json({ message: 'No associated roles found for this event' });
        }

        const userInfo = {
            idUserProfile,
            idUserEvento: userEvento.id, // Adicione o ID do UserEvento
            evento: {
                idEvento: userEvento.Evento.id,
                cargo: userEvento.cargos, // Armazena todos os cargos
                eventoNome: nomeURL
            }
        };

        const tokenEvento = jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '5h' });

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 5);

        // Armazena o token no banco de dados, incluindo o idUserEvento
        await TokenEventos.create({
            token: tokenEvento,
            idUserProfile,
            idUserEvento: userEvento.id, // Passa o idUserEvento aqui
            expiresAt
        });

        res.json({ token: tokenEvento, userInfo });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login', error: error.message });
    }
});

module.exports = router;
