const express = require('express');
const router = express.Router();

router.post('/users', async (req, res) => {
 res.json("foi")
 console.log(req.user)
  }
);

module.exports = router;