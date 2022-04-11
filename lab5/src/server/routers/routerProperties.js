const router = require('express').Router();
const path = require("path");

const { writeToFile } = require('./functions');

let properties = require('../json/properties.json');

router.get('/', (req, res) => {
    res.json(properties);
});

router.post('/', (req, res) => {
    const property = req.body;
    properties = property;
    writeToFile('./server/json/properties.json', properties);
});

module.exports = router;
