const express = require('express');

const router = express.Router();


router.get("/teste", (req, res)=>{
    res.json("Usuario passou: "+ req.user)
    console.log(req.user)
})

module.exports = router