const router = require('express').Router();
const path = require("path");
const { findIdItem } = require('./functions');
const paintings = require("../db");
const jsonParser = require('express').json();

router.get('/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'painting.html')); //описание картины
});

router.get('/:id/actual', (req, res) => {
    const id = req.params.id; //получаем индекс и находим картину
    const painting = findIdItem(paintings, id);
    res.json(painting);
});

router.put('/:id', (req, res)=>{
    const body = {
        ...req.body,
        id: req.params.id,
    };
    res.redirect(`../../gallery?value=${JSON.stringify(body)}`); //переадресация
});

router.post('/:id', (req, res)=>{
    res.redirect(307, `../../gallery?value=${req.params.id}`); //временная переадресация
});

router.delete('/:id', (req, res)=>{
    res.redirect(`../../gallery?value=${req.params.id}`);
});

module.exports = router;