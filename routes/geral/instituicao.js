const express = require('express');
const {Instituicoes} = require("../../model/db");
const { where } = require('sequelize');
const router = express.Router();

router.post("/cadastrar", async (req, res) => {
    const {nome, cnpj} = req.body 

    try {
      const validar = await Instituicoes.findOne({ where: { cnpj: cnpj } })

      if (validar) {
        return res.status(409).json({ message: 'Instituição já está cadastrada.' });
      }

      const status = "Pendente"
      const instituicao = await Instituicoes.create({nome, cnpj, status})

      res.status(200).json(instituicao)

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro ao cadastrar a instituicao.' });
    }
  });

  router.get("/filtro", async (req, res) => {
    const { nome } = req.body; // Usar req.query para dados em GET

    try {
        // Buscar instituição com nome exatamente igual ao informado
        const instituicoes = await Instituicoes.findAll({
            where: {
                nome: nome
            }
        });

        // Verificar se nenhuma instituição foi encontrada
        if (instituicoes.length === 0) {
            return res.status(404).json({ message: 'Instituição não encontrada.' });
        }

        // Retornar instituições encontradas
        res.status(200).json(instituicoes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro ao buscar as instituições.' });
    }
});

  module.exports = router
  