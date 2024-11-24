const express = require('express');
const path = require('path');
const { Arquivos, Eventos } = require('../../../model/db'); // Modelo usado no banco
const router = express.Router();

// Rota para servir o arquivo
router.get('/apresentacao/:id', async (req, res) => {
    try {
        // Encontre o registro no banco de dados
        const eventArquivo = await Eventos.findByPk(req.params.id);

        if (!eventArquivo) {
            return res.status(404).json({ message: 'Arquivo nao encontrado não encontrado' });
        }


        const modeloApresentacao = eventArquivo.modeloApresentacao


        // Normaliza o caminho do arquivo
        const filePath = path.resolve(modeloApresentacao.replace(/\\/g, '/'));

        // Envia o arquivo ao navegador
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Erro ao enviar o arquivo:', err);
                res.status(500).json({ message: 'Erro ao abrir o arquivo.' });
            }
        });
    } catch (error) {
        console.error('Erro ao buscar arquivo:', error);
        res.status(500).json({ message: 'Erro interno ao buscar arquivo.' });
    }
});

router.get('/arquivo/:id', async (req, res) => {
    try {
        // Encontre o registro no banco de dados
        const eventArquivo = await Arquivos.findOne({ where: { idEventos: req.params.id } });

        if (!eventArquivo) {
            return res.status(404).json({ message: 'Arquivo não encontrado.' });
        }
        console.log(eventArquivo)
        
        const modeloArquivos = eventArquivo.modeloArquivo;

        // Verifica se o caminho do arquivo é válido
        if (!modeloArquivos) {
            return res.status(404).json({ message: 'Modelo de arquivo não encontrado no banco de dados.' });
        }

        // Normaliza o caminho do arquivo
        const filePath = path.resolve(modeloArquivos.replace(/\\/g, '/'));

        // Envia o arquivo ao navegador
        res.sendFile(filePath,  (err) => {
            if (err) {
                console.error('Erro ao enviar o arquivo:', err);
                res.status(500).json({ message: 'Erro ao abrir o arquivo.' });
            }
        });
    } catch (error) {
        console.error('Erro ao buscar arquivo:', error);
        res.status(500).json({ message: 'Erro interno ao buscar arquivo.' });
    }
});

module.exports = router;
