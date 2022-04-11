const router = require('express').Router();
const path = require("path");

const brokersList = require('../json/brokers.json');
const {writeToFile, findNameIndex} = require('./functions');

router.get('/data', (req, res) => {
    res.json(brokersList);
});

router.post('/', (req, res) => {
    const broker = req.body;
    brokersList.push(broker);
    writeToFile('./server/json/brokers.json', brokersList);
    res.json(brokersList);
});

router.put('/', (req, res) => {
    const broker = req.body;
    const index = findNameIndex(brokersList, broker.name);
    brokersList[index] = broker;
    writeToFile('./server/json/brokers.json', brokersList);
    res.json(brokersList);
});

router.delete('/', (req, res) => {
    const broker = req.body;
    const index = findNameIndex(brokersList, broker.name);
    brokersList.splice(index, 1);
    writeToFile('./server/json/brokers.json', brokersList);
    res.json(brokersList);
});

module.exports = router;
