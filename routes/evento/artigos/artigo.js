const express = require('express');
const router = express.Router();
const { ArquivoSubmetidos, Eventos, UserProfile, Autores, CategoriaArquivos, ArquivoEspecialidades, AutorArquivos } = require("../../../model/db");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Função para garantir que o diretório exista
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Função slugify para normalizar o nome do arquivo
function slugify(string) {
    return string
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/[^\w\-]+/g, '') // Remove caracteres não alfanuméricos
        .replace(/\-\-+/g, '-') // Remove múltiplos hífens
        .replace(/^-+/, '') // Remove hífen no início
        .replace(/-+$/, ''); // Remove hífen no final
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Aqui, presumo que você tenha o ID do usuário em algum lugar, por exemplo, req.user.id
        // Isso dependerá de como está estruturada a autenticação. Vou usar req.user.id como exemplo.
        console.log("analise aqui")
        console.log(req.user)
        console.log("analise aqui")
        const userId = req.user ? req.user.idUserProfile : 'default-user'; // Ajuste conforme necessário


        // Definir o caminho como uploads/userid/arquivos
        const userDirSemAutoria = path.join('uploads', userId.toString(), 'arquivos');
        const userDirCompleto = path.join('uploads', userId.toString(), 'arquivos');

        // Cria o diretório se não existir
        ensureDirExists(userDirSemAutoria);
        ensureDirExists(userDirCompleto);

        // Define o diretório final
        cb(null, userDirSemAutoria);
        cb(null, userDirCompleto);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${slugify(file.originalname)}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });


router.post('/submissao/:nomeURL', upload.fields([
    { name: 'arquivoCompleto' },
    { name: 'arquivoSemAutoria' }
]), async (req, res) => {
    console.log(req.user);
    try {
        const autores = req.body.autores; // Certifique-se de que `autores` seja enviado corretamente no corpo da requisição
        const event = await Eventos.findOne({ where: { nomeURL: req.params.nomeURL } });

        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }

        const data = {
            idCategoriaArquivos: req.body.idCategoriaArquivos,
            titulo: req.body.titulo,
            resumo: req.body.resumo,
            abstract: req.body.abstract,
            palavrasChaves: req.body.palavrasChaves,
            keyWords: req.body.keyWords,
            idGrandeAreas: req.body.grandeArea,
            idAreas: req.body.area,
            idSubareas: req.body.subarea,
            idEspecialidades: req.body.especialidade,
            arquivoCompleto: req.files.arquivoCompleto ? req.files.arquivoCompleto[0].path : null,
            arquivoSemAutoria: req.files.arquivoSemAutoria ? req.files.arquivoSemAutoria[0].path : null,
            status: req.body.status,
            idEventos: event.id // Associando o arquivo ao evento
        };

        // Criar o arquivo submetido
       const arquivo = await ArquivoSubmetidos.create(data);


        const ArquivoEspecialidade = await ArquivoEspecialidades.create({
            idArquivo: arquivo.id,
            idEspecialidades: req.body.idEspecialidades

        });

        const aUser = await Autores.findOne({where: {idUserProfiles: req.user.idUserProfile}});

        console.log(ArquivoEspecialidade)

        const AutorArquivo = await AutorArquivos.create({
            idArquivo: arquivo.id,
            idAutor: aUser.id
        });

        console.log(AutorArquivo)



        

        res.status(201).json({ message: 'Arquivo submetido cadastrado com sucesso!'});

    } catch (error) {
        console.error('Erro ao processar arquivos ou cadastrar autores:', error);
        res.status(500).json({ error: 'Erro ao processar arquivos ou cadastrar autores: ' + error.message });
    }
});



router.post("/cadastrar/categoria", async (req, res) => {
    const {nome, descricao} = req.body
    try {
        const categoria = await CategoriaArquivos.create({nome, descricao});
        res.status(201).json(categoria);
    } catch (error) {        
        res.status(500).json({ error: 'Erro ao cadastrar categoria: ' + error.message });
    }
});

router.get("/categorias", async (req, res) => {
    try {
        const categorias = await CategoriaArquivos.findAll();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias: ' + error.message });
    }
});

module.exports = router;