const router = require('express').Router();
const { findIdItem } = require('./functions');
const books = require("../db");
const jsonParser = require('express').json();

router.get('/:id', (req, res) => {
    const id = req.params.id; //получаем id
    const book = findIdItem(books, id); //находим книгу с id
    res.render('book', { book: book, title: book.name }); //загрузка книги
});

router.put('/:id', (req, res)=>{
    const body = {
        ...req.body,
        id: req.params.id,
    };
    res.redirect(`../../?value=${JSON.stringify(body)}`); //перенаправляем на главную страницу
});

router.delete('/:id', (req, res)=>{
    res.redirect(`../../?value=${req.params.id}`); //перенаправляем на главную страницу
});

module.exports = router;