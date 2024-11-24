const express = require('express');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const { TokenEventos, Cargo, UserEvento, Eventos, Avaliadores, AvaliadorSubAreas, Autores } = require("../../model/db");

const router = express.Router();

// Registro de cargos para um evento
router.post('/register/EditorChefe/:nomeURL', async (req, res) => {
  const { nomeURL } = req.params;
  const cargos = req.body.cargos;

  if (!Array.isArray(cargos) || cargos.length === 0) {
    return res.status(400).json({ message: 'Cargos must be a non-empty array' });
  }

  const validCargo = ['Editor Chefe'];
  const invalidCargo = cargos.filter(cargo => !validCargo.includes(cargo));
  if (invalidCargo.length > 0) {
    return res.status(400).json({ message: `Invalid cargo: ${invalidCargo.join(', ')}` });
  }

  try {
    // Buscar o evento pelo nomeURL
    const evento = await Eventos.findOne({ where: { nomeURL } });
    if (!evento) {
      return res.status(404).json({ message: 'Evento not found' });
    }

    // Encontrar ou criar o registro de UserEvento
    const [userEvento] = await UserEvento.findOrCreate({
      where: {
        idUserProfile: req.user.id,
        idEvento: evento.id
      }
    });

    // Buscar cargos existentes associados ao UserEvento
    const existingCargos = await userEvento.getCargos();
    const existingCargoNames = existingCargos.map(cargo => cargo.cargo);

    // Filtrar cargos que já estão associados
    const newCargos = cargos.filter(cargo => !existingCargoNames.includes(cargo));

    if (newCargos.length === 0) {
      return res.status(200).json({ message: 'No new cargos to add' });
    }

    // Mapear cargos novos para IDs
    const cargoRecords = await Cargo.findAll({ where: { cargo: { [Op.in]: newCargos } } });
    if (cargoRecords.length !== newCargos.length) {
      return res.status(400).json({ message: 'Some cargos do not exist in the database' });
    }

    // Associar os novos cargos ao UserEvento
    await userEvento.addCargos(cargoRecords);

    res.status(201).json({ message: 'User successfully registered for the event with new roles' });
  } catch (error) {
    console.error('Error registering user for event:', error);
    res.status(500).json({ message: 'Error registering user for event', error: error.message });
  }
});

router.post('/register/Autor/:nomeURL', async (req, res) => {
    const { nomeURL } = req.params;
    const cargos = req.body.cargos;
  
    if (!Array.isArray(cargos) || cargos.length === 0) {
      return res.status(400).json({ message: 'Cargos must be a non-empty array' });
    }
  
    const validCargo = ['Autor'];
    const invalidCargo = cargos.filter(cargo => !validCargo.includes(cargo));
    if (invalidCargo.length > 0) {
      return res.status(400).json({ message: `Invalid cargo: ${invalidCargo.join(', ')}` });
    }
  
    try {
      // Buscar o evento pelo nomeURL
      const evento = await Eventos.findOne({ where: { nomeURL } });
      if (!evento) {
        return res.status(404).json({ message: 'Evento not found' });
      }
  
      // Encontrar ou criar o registro de UserEvento
      const [userEvento] = await UserEvento.findOrCreate({
        where: {
          idUserProfile: req.user.id,
          idEvento: evento.id
        }
      });

      
      const Autor = await Autores.create({
        idUserProfiles: req.user.id,
        idInstituicao: req.body.idInstituicao,
        periodo: req.body.periodo,
        apresentador: req.body.apresentador,
        curso: req.body.curso,
      })
      console.log(Autor)
  
      // Buscar cargos existentes associados ao UserEvento
      const existingCargos = await userEvento.getCargos();
      const existingCargoNames = existingCargos.map(cargo => cargo.cargo);
  
      // Filtrar cargos que já estão associados
      const newCargos = cargos.filter(cargo => !existingCargoNames.includes(cargo));
  
      if (newCargos.length === 0) {
        return res.status(200).json({ message: 'No new cargos to add' });
      }
  
      // Mapear cargos novos para IDs
      const cargoRecords = await Cargo.findAll({ where: { cargo: { [Op.in]: newCargos } } });
      if (cargoRecords.length !== newCargos.length) {
        return res.status(400).json({ message: 'Some cargos do not exist in the database' });
      }
  
      // Associar os novos cargos ao UserEvento
      await userEvento.addCargos(cargoRecords);
  
      res.status(201).json({ message: 'User successfully registered for the event with new roles' });
    } catch (error) {
      console.error('Error registering user for event:', error);
      res.status(500).json({ message: 'Error registering user for event', error: error.message });
    }
  });
  
  

// Registro de cargos para um evento
router.post('/register/avaliador/:nomeURL', async (req, res) => {
    const { nomeURL } = req.params;
    const cargos = req.body.cargos;
    const conhecimento = req.body.idAreaConhecimento;
    const instituicao = req.body.idInstituicao;
    const linkLattes = req.body.linkLattes;    
    const status = "Pendente";
    const subArea = req.body.idSubArea

  
    if (!Array.isArray(cargos) || cargos.length === 0) {
      return res.status(400).json({ message: 'Cargos must be a non-empty array' });
    }
  
    const validCargo = ['Avaliador'];
    const invalidCargo = cargos.filter(cargo => !validCargo.includes(cargo));
    if (invalidCargo.length > 0) {
      return res.status(400).json({ message: `Invalid cargo: ${invalidCargo.join(', ')}` });
    }
  
    try {
      // Buscar o evento pelo nomeURL
      const evento = await Eventos.findOne({ where: { nomeURL } });
      if (!evento) {
        return res.status(404).json({ message: 'Evento not found' });
      }
  
      // Encontrar ou criar o registro de UserEvento
      const [userEvento] = await UserEvento.findOrCreate({
        where: {
          idUserProfile: req.user.id,
          idEvento: evento.id
        }
      });
  
      // Buscar cargos existentes associados ao UserEvento
      const existingCargos = await userEvento.getCargos();
      const existingCargoNames = existingCargos.map(cargo => cargo.cargo);
  
      // Filtrar cargos que já estão associados
      const newCargos = cargos.filter(cargo => !existingCargoNames.includes(cargo));
  
      if (newCargos.length === 0) {
        return res.status(200).json({ message: 'No new cargos to add' });
      }
  
      // Mapear cargos novos para IDs
      const cargoRecords = await Cargo.findAll({ where: { cargo: { [Op.in]: newCargos } } });
      if (cargoRecords.length !== newCargos.length) {
        return res.status(400).json({ message: 'Some cargos do not exist in the database' });
      }
  
      // Associar os novos cargos ao UserEvento
      await userEvento.addCargos(cargoRecords);

      const avaliador =await Avaliadores.create({
        idAreaConhecimento: conhecimento,
        linkLattes: linkLattes,
        status: status,
        idUserProfiles: req.user.id,
        idInstituicao: instituicao
      })

      await AvaliadorSubAreas.create({
        idAvaliadores: avaliador.id,
        idSubAreas: subArea,
      })
  
      res.status(201).json({ message: 'User successfully registered for the event with new roles' });
    } catch (error) {
      console.error('Error registering user for event:', error);
      res.status(500).json({ message: 'Error registering user for event', error: error.message });
    }
  });
// Login para eventos
router.post('/login/:nomeURL', async (req, res) => {
  const { nomeURL } = req.params;

  try {
    const idUserProfile = req.user.id;

    const evento = await Eventos.findOne({ where: { nomeURL } });
    if (!evento) {
      return res.status(404).json({ message: 'Evento not found' });
    }

    const userEvento = await UserEvento.findOne({
      where: { idUserProfile, idEvento: evento.id },
      include: {
        model: Cargo,
        through: { attributes: [] } // Exclui os dados da tabela intermediária
      }
    });

    if (!userEvento) {
      return res.status(400).json({ message: 'No associated roles found for this event' });
    }

    // Coleta todos os cargos associados ao usuário em qualquer evento
    const allUserCargos = await Cargo.findAll({
      include: {
        model: UserEvento,
        where: { idUserProfile }
      }
    });

    const allCargos = allUserCargos.map(cargo => cargo.cargo);

    const userInfo = {
      idUserProfile,
      idUserEvento: userEvento.id,
      evento: {
        idEvento: userEvento.idEvento,
        cargos: userEvento.Cargos.map(cargo => cargo.cargo), // Cargos para o evento atual
        allCargos, // Todos os cargos associados ao usuário
        eventoNome: nomeURL
      }
    };

    const tokenEvento = jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '5h' });

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 5);

    await TokenEventos.create({
      token: tokenEvento,
      idUserProfile,
      idUserEvento: userEvento.id,
      expiresAt
    });

    res.json({ token: tokenEvento, userInfo });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login', error: error.message });
  }
});

module.exports = router;
