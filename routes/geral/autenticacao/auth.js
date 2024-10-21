const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { UserProfile, Token, Cargo, Autores, Admin } = require("../../../model/db");

const router = express.Router();
router.post('/register/user', async (req, res) => {
  const { email, nome, senha, cpf, periodo, apresentador, curso, instituicao } = req.body;
  const cargos = ['Autor'];

  // Verifica se cargos é um array e não está vazio
  if (!Array.isArray(cargos) || cargos.length === 0) {
    return res.status(400).json({ message: 'cargo must be a non-empty array' });
  }

  // Valida os cargos
  const validcargo = ['Autor'];
  const invalidcargo = cargos.filter(cargo => !validcargo.includes(cargo));

  if (invalidcargo.length > 0) {
    return res.status(400).json({ message: `Invalid cargo: ${invalidcargo.join(', ')}` });
  }

  try {
    // Verificar se o usuário já existe pelo email ou CPF
    const existingUser = await UserProfile.findOne({
      where: {
        [Op.or]: [
          { email },
          { cpf }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    // Define validado como true se 'Autor' estiver entre os cargos, senão false
    const validado = cargos.includes('Autor');

    // Cria o usuário
    const user = await UserProfile.create({ email, nome, senha: hashedSenha, cpf, validado });

    // Cria o autor associado ao usuário
    await Autores.create({
      idUserProfiles: user.id,
      idInstituicao: instituicao,
      periodo: Array.isArray(periodo) ? periodo.join(', ') : periodo, // Ajuste aqui se `periodo` for um array
      apresentador,
      curso
    });

    // Buscar cargos no banco
    const roleRecords = await Cargo.findAll({ where: { cargo: cargos } });

    if (roleRecords.length === 0) {
      return res.status(400).json({ message: 'No valid roles found' });
    }

    // Associar cargos ao usuário
    await user.addCargos(roleRecords); // Verifique se o método está correto para adicionar cargos

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error); // Loga o erro completo
    res.status(500).json({ message: 'Error registering user', error: error.message }); // Alterado para 500 para refletir erro interno
  }
});



// Login de usuário
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    // Inclui o modelo Cargo para garantir que os cargos sejam carregados
    const user = await UserProfile.findOne({ 
      where: { email }, 
      include: {
        model: Cargo,
        through: { attributes: [] } // Exclui atributos da tabela intermediária
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or senha' });
    }

    const validsenha = await bcrypt.compare(senha, user.senha);
    if (!validsenha) {
      return res.status(400).json({ message: 'Invalid email or senha' });
    }

    // Verifica se o usuário tem cargos associados
    if (!user.Cargos || user.Cargos.length === 0) {
      return res.status(400).json({ message: 'User has no roles associated' });
    }

    // Mapeia os cargos do usuário
    const usercargo = user.Cargos.map(cargo => cargo.cargo);

    // Inclui os cargos no payload do JWT
    const token = jwt.sign({ id: user.id, cargo: usercargo }, process.env.JWT_SECRET, { expiresIn: '5h' });

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 5);

    await Token.create({ token, idUserProfiles: user.id, expiresAt });

    res.json({ token });

  } catch (error) {
    console.error('Login error:', error); // Log detalhado do erro
    res.status(500).json({ message: 'An error occurred during login', error: error.message });
  }
});


router.post('/register/admin', async (req, res) => {
  const { email, nome, senha, cpf, linkLattes, instituicao } = req.body;

  const cargos = ["Admin"]

  if (!Array.isArray(cargos) || cargos.length === 0) {
    return res.status(400).json({ message: 'cargo must be a non-empty array' });
  }

  const validcargo = ['Admin'];
  const invalidcargo = cargos.filter(cargo => !validcargo.includes(cargo));

  if (invalidcargo.length > 0) {
    return res.status(400).json({ message: `Invalid cargo: ${invalidcargo.join(', ')}` });
  }

  // Verificar se o usuário já existe pelo email ou CPF
  const existingUser = await UserProfile.findOne({
    where: {
      [Op.or]: [
        { email },
        { cpf }
      ]
    }
  });

  if (existingUser) {
    return res.status(400).json({ message: 'User already registered' });
  }

  const hashedsenha = await bcrypt.hash(senha, 10);

  // Define validado como true se 'Autor' estiver entre os cargos, senão false
  const validado = cargos.includes('Autor');

  try {
    const user = await UserProfile.create({ email, nome, senha: hashedsenha, cpf, validado });
    const status = "Pendente"
    const admin = await Admin.create({linkLattes, status, idUserProfiles: user.id, idInstituicao: instituicao})

    // Buscar cargos no banco
    const roleRecords = await Cargo.findAll({ where: { cargo: cargos } });
    console.log(roleRecords);
    console.log(admin)

    if (roleRecords.length === 0) {
      return res.status(400).json({ message: 'No valid roles found' });
    }

    // Associar cargos ao usuário
    await user.addCargo(roleRecords);
    console.log(user.addCargo(roleRecords));

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error); // Loga o erro completo
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
});




module.exports = router;
