const express = require('express');
const {UserProfile, Organizadores} = require("../../../../model/db");
const { where } = require('sequelize');
const router = express.Router();

router.post("/validar/organizador", async (req, res) => {
    const userID = req.body.idUserProfiles; // Obter o ID do usuário do corpo da requisição
  
    try {
      // Buscar o usuário com o ID recebido
      const user = await UserProfile.findOne({ where: { id: userID } });
      const organizador = await Organizadores.findOne({ where: { id: userID } });
  
      // Verifica se o usuário foi encontrado
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      if (!organizador) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      // Atualiza o campo 'validado' para true
      user.validado = true; // Supondo que 'validado' é o campo a ser atualizado
      organizador.status = "Aprovado"
      await user.save(); // Salva as alterações no banco de dados
      await organizador.save();
  
      res.json({ message: 'Usuário validado com sucesso!', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro ao validar o usuário.' });
    }
  });



router.get("/validar/organizador", async (req, res) => {
    try {
      // Buscar todos os usuários onde o campo validado é false
      const organizadores = await Organizadores.findAll({
        where: {
          status: "Pendente" // Filtrar usuários com validado como false
        }
      });
  
      // Verifica se há usuários encontrados
      if (organizadores.length === 0) {
        return res.status(404).json({ message: 'No users found with status as Pendente.' });
      }
  
      res.json(organizadores); // Retorna a lista de usuários
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'An error occurred while fetching users', error: error.message });
    }
  });

  module.exports = router
  