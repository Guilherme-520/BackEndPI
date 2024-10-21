const express = require('express');
const {Instituicoes} = require("../../model/db");
const { where } = require('sequelize');
const router = express.Router();

router.post("/", async (req, res) => {
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


  module.exports = router
  