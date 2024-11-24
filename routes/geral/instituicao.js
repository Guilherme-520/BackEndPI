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

      res.status(200).json("A intituição cadastrada ainda deve ser aprovada ", instituicao)

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro ao cadastrar a instituicao.' });
    }
  });

  router.get("/filtro", async (req, res) => {
    const { nome } = req.body;

    try {
        const instituicoes = await Instituicoes.findAll({ 
            where: { 
                status:`Aprovado`  // Use Op.iLike corretamente
            }
        });

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
  