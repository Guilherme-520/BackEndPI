require('dotenv').config();
const express = require('express');
const { sequelize } = require('./model/db');
const authRoutes = require('./routes/geral/autenticacao/auth');
const authMiddleware = require('./routes/geral/autenticacao/middleware');
const middlewareEvento = require('./routes/novo/middlewareEvento');

const app = express();
app.use("/uploads", express.static('uploads'));
app.use(express.json());

app.use('/auth', authRoutes);


const instituicao = require('./routes/geral/instituicao')
app.use('/instituicao', instituicao)


const home = require("./routes/novo/home")
app.use('/home', authMiddleware(["Admin", "Autor"]), home)

const validar = require("./routes/geral/autenticacao/validacao/validar")
app.use("/controle", authMiddleware(["Admin"]), validar )


const validarOrg = require("./routes/geral/autenticacao/validacao/validarOrganizador")
app.use("/controle/editorchefe", authMiddleware(["Editor Chefe"]), validarOrg )

// Rotas protegidas por tipos de usuário
const evento = require('./routes/evento/evento');
app.use('/evento', authMiddleware(['Admin']), evento );

// Rotas protegidas por tipos de usuário
const authEvento = require('./routes/evento/authEvento');
app.use('/authEvento', authMiddleware(['Editor Chefe']), authEvento );



// Rotas protegidas por tipos de usuário
const foi = require('./routes/novo/foi');
app.use('/foi', middlewareEvento(['Editor Chefe']), foi );







const PORT = process.env.PORT || 3031;
app.listen(PORT, async () => {
  await sequelize.authenticate();
  console.log(`Server running on port ${PORT}`);
});
