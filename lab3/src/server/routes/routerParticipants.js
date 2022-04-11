const router = require('express').Router();
const participants = require("../participants");
const path = require("path");
const jsonParser = require('express').json();
const {findIdIndex, findIdItem, writeToFile, idGenerator} = require("./functions");

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'participants.html')); //список участников
});

router.get('/actual', (req, res) => {
    res.json(participants); //список участников
});

router.get('/:id', (req, res) => {
    const id = req.params.id; //получаем индекс и находим участника
    const item = findIdItem(participants, id);
    res.json(item);
});

router.post('/', (req, res) => {
    const participant = {...req.body, id: idGenerator()}; //получаем данные из формы и добавляем участников
    participants.push(participant); //заносим в массив
    writeToFile('./server/participants.json', JSON.stringify(participants)); //заносим в db
    res.json(participants);
});

router.put('/', (req, res) => {
    const item = req.body; //получаем участника, которого обновили
    const index = findIdIndex(participants, item.id); //находим индекс
    if(index !== -1){
        participants[index] = item;
        writeToFile('./server/participants.json', JSON.stringify(participants));
    } else {
        console.warn("Участника с таким индексом не существует");
    }
    res.json(participants);
});

router.delete('/', (req, res)=>{
    const id = req.body;
    const index = findIdIndex(participants, id.id);
    if(index !== -1){
        participants.splice(index, 1);
        writeToFile('./server/participants.json', JSON.stringify(participants));
    } else {
        console.warn("Участника с таким индексом не существует");
    }
    res.json(participants);
});

module.exports = router;