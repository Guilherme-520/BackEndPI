const express = require('express');
const path = require('path');
const { GrandeAreas, Areas, SubAreas, Especialidades } = require('../../../model/db'); // Modelo usado no banco
const router = express.Router();

// Rota para servir o arquivo
router.post('/grande', async (req, res) => {
   const {nome, descricao} = req.body

   try {

    const GrandeArea = await GrandeAreas.create({nome, descricao})
    

   res.status(200).json(GrandeArea)
    
   } catch (error) {
    res.status(500).json("Erro ao cadastrar grande area")
   }

   
});


router.post('/area', async (req, res) => {
    const nome = req.body.nome
    const descricao = req.body.descricao
    const grande = req.body.idGrandeAreas
    try {
 
     const GrandeArea = await GrandeAreas.findOne({where: {id: grande}})

     if (!GrandeArea) {
         return res.status(404).json({ message: 'Grande area não encontrada.' });
     }
 
     const Area = await Areas.create({nome, descricao, idGrandeAreas: grande})
 
    res.status(200).json(Area)
     
    } catch (error) {
     res.status(500).json("Erro ao cadastrar grande area")
    }
 
    
 });

 router.post('/subarea', async (req, res) => {
    const nome = req.body.nome
    const descricao = req.body.descricao
    const area = req.body.idAreas

    try {
 
     const Area = await Areas.findOne({where: {id: area}}) 

     if (!Area) {
         return res.status(404).json({ message: 'Area nao encontrada.' });
     }
 
     const SubArea = await SubAreas.create({nome, descricao, idAreas: area})
 
    res.status(200).json(SubArea)
     
    } catch (error) {      

     res.status(500).json("Erro ao cadastrar grande area")
    }
    
 });


 router.post("/especialidade", async (req, res) => {
    const nome = req.body.nome
    const descricao = req.body.descricao
    const subarea = req.body.idSubAreas

    try {
 
     const SubArea = await SubAreas.findOne({where: {id: subarea}}) 

     if (!SubArea) {
         return res.status(404).json({ message: 'Subarea nao encontrada.' });
     }
 
     const Especialidade = await Especialidades.create({nome, descricao, idSubArea: subarea})
 
    res.status(200).json(Especialidade)
     
    } catch (error) {

     res.status(500).json("Erro ao cadastrar grande area")  
     
    }
});



 router.get('/grande', async (req, res) => {
    try {
        const grandeAreas = await GrandeAreas.findAll();
        res.json(grandeAreas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar grande areas: ' + error.message });
    }
});

router.get('/area', async (req, res) => {
    try {
        const areas = await Areas.findAll();
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar areas: ' + error.message });
    }
});


router.get('/subarea', async (req, res) => {
    try {
        const subareas = await SubAreas.findAll();
        res.status(200).json(subareas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar subareas: ' + error.message });
    }
});

router.get('/especialidade', async (req, res) => {
    try {
        const especialidades = await Especialidades.findAll();
        res.status(200).json(especialidades);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar especialidades: ' + error.message });
    }
});




module.exports = router;
