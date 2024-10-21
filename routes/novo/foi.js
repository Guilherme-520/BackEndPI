const express = require('express');

const router = express.Router();


router.get("/teste", (req, res)=>{
    res.json("Usuario passou: dados do usuario")
    console.log(req.user)
})

module.exports = router