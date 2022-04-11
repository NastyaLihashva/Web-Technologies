const router = require('express').Router();
const paintings = require("../db");

router.get('/', (req, res)=>{
    res.json(paintings); //получаем картины
});

module.exports = router;