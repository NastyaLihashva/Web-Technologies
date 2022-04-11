const router = require('express').Router();
const path = require("path");

const stocksList = require('../json/stocks.json');
const { writeToFile, findIdIndex } = require('./functions');

router.get('/', (req, res) => {
    res.json(stocksList);
});

router.post('/', (req, res) => {
    const stock = req.body;
    stocksList.push(stock);
    writeToFile('./server/json/stocks.json', stocksList);
    res.json(stocksList);
});

router.put('/', (req, res) => {
    const stock = req.body;
    const index = findIdIndex(stocksList, stock.id);
    stocksList[index] = stock;
    writeToFile('./server/json/stocks.json', stocksList);
    res.json(stocksList);
});

router.delete('/', (req, res) => {
    const stock = req.body;
    console.log(stock.id);
    const index = findIdIndex(stocksList, stock.id);
    console.log(index);
    stocksList.splice(index, 1);
    writeToFile('./server/json/stocks.json', stocksList);
    res.json(stocksList);
});

module.exports = router;
