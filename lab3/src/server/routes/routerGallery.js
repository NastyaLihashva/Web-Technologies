const router = require('express').Router();
const paintings = require("../db");
const path = require("path");
const jsonParser = require('express').json();
const {findIdIndex, writeToFile, sortAuction} = require("./functions");
let actualPaintings = paintings.sort(sortAuction);

router.get('/', (req, res) => { //отправка ответа express
    res.sendFile(path.join(__dirname, '../public', 'gallery.html')); //список картин
});

router.get('/actual', (req, res) => {
    res.json(actualPaintings); //получаем актуальные картины
});

router.post('/', (req, res) => {
    const painting = {...req.body, id: req.query.value}; //получаем данные из формы и добавляем картины
    paintings.push(painting); //в массив
    actualPaintings = paintings.sort(sortAuction);
    writeToFile('./server/db.json', JSON.stringify(paintings)); //записываем в db.json
    res.json({done: "ok"});
});

router.put('/', (req, res) => {
    const painting = JSON.parse(req.query.value); //получаем картину которую обновили
    const index = findIdIndex(paintings, painting.id); //находим индекс картины
    if(index !== -1){
        paintings[index] = painting;
        const paintingJson = JSON.stringify(paintings);
        actualPaintings = paintings.sort(sortAuction);
        writeToFile('./server/db.json', paintingJson);
    } else {
        console.warn("Картины с таким индексом не существует");
    }
    res.json({done: "ok"});
});

router.delete('/', (req, res)=>{
    const id = req.query.value; //ищем книгу и удаляем ее по индексу
    const index = findIdIndex(paintings, id);
    if(index !== -1){
        paintings.splice(index, 1);
        writeToFile('./server/db.json', JSON.stringify(paintings));
    } else {
        console.warn("Картины с таким индексом не существует");
    }
    res.json(actualPaintings);
});

module.exports = router;