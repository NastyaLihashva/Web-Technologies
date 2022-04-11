const router = require('express').Router();
const path = require("path");
let properties = require("../json/properties.json");
const {writeToFile} = require("./functions");
const jsonParser = require('express').json();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'properties.html')); //получаем параметры аукциона
});

router.get('/actual', (req, res) => {
    res.json(properties);
});

router.post('/', (req, res)=>{
    const prop = req.body;
    properties = prop;
    writeToFile('./server/json/properties.json', JSON.stringify(prop));
    res.json({done: "ok"});
});

module.exports = router;