const router = require('express').Router();
const books = require("../db");
let actualBooks = books;
const {findIdIndex, idGenerator, writeToFile, filterData} = require("./functions");

router.get('/', (req, res) => {
    res.render('index', { dbArray: books}); //загрузка страницы
});

router.get('/filter/:filter', (req, res) => {
    const filter = req.params.filter; //получаем фильтр и фильтруем данные
    actualBooks = filterData(filter, books);
    res.json(actualBooks);
});

router.post('/', (req, res) => {
    let book = req.body; //получаем данные из формы и добавляем книги
    book = {
        ...book,
        inLibrary:"yes",
        id: idGenerator(),
    }
    books.push(book); //в массив
    actualBooks = books;
    writeToFile(JSON.stringify(books)); //в db.json
    res.json(actualBooks);
});

router.put('/', (req, res) => {
    const book = JSON.parse(req.query.value); //получаем книгу которую обновили
    const index = findIdIndex(books, book.id); //ищем индекс книги
    if(index !== -1){
        if(books[index].inLibrary === "yes"){
            delete books[index].returnDate;
            delete books[index].readerName;
        }
        books[index] = book;
        const bookJson = JSON.stringify(books);
        writeToFile(bookJson);
    } else {
        console.warn("Книги с таким индексом не существует");
    }
    res.render('index', { dbArray: books});
});

router.delete('/', (req, res)=>{
    const id = req.query.value; //ищем книгу и удаляем ее по индексу
    const index = findIdIndex(books, id);
    const actualIndex = findIdIndex(actualBooks, id);
    if(index !== -1){
        books.splice(index, 1);
        actualBooks.splice(actualIndex, 1);
        writeToFile(JSON.stringify(books));
    } else {
        console.warn("Книги с таким индексом не существует");
    }
    res.json(actualBooks);
});

module.exports = router;