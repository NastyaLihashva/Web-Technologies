/*фильтрация книг*/

const fs = require("fs");

exports.idGenerator = () => '_' + Math.random().toString(36).substr(2, 9); //рандомная генерация id

exports.findIdItem = (books, id) => { //поиск книги
    for(let i = 0; i < books.length; i++){
        if(books[i].id === id)
            return books[i];
    }
}

exports.findIdIndex = (books, id) => { //поиск индекса
    for(let i = 0; i < books.length; i++) {
        if (books[i].id === id)
            return i;
    }
    return -1;
};

exports.writeToFile = bookJson => { //запись в базу данных
    try{
        fs.writeFile('./server/db.json', bookJson, (err) => {
            if (err) throw err;
            console.log('База данных успешно обновлена');
        });
    } catch (err) {
        console.error(err);
    }
}

exports.toDate = (string) => {
    const array = string.split('.');
    const date = new Date(+array[2], +array[1]-1, +array[0]);
    return date.getTime();
}

const sortDate = (a, b) => this.toDate(a.returnDate) - this.toDate(b.returnDate); //сортировка по датам


exports.filterData = (filterType, data) => {
    let filteredData;
    switch (filterType){
        case "all": //без фильтра
            filteredData = [...data];
            break;
        case "availability": //в наличии
            filteredData = data.filter(item => item.inLibrary.toLowerCase().trim() === "yes");
            break;
        case "expired": //просрок возврата
            filteredData = data.filter(item => (
                item.inLibrary.toLowerCase().trim() === "no" &&
                item.returnDate && this.toDate(item.returnDate) < Date.now()
            ));
            break;
        case "returnDate": //дата возврата
            filteredData = data
                .filter(item => item.inLibrary.toLowerCase().trim() === "no")
                .sort(sortDate);
            break;
    }
    return filteredData;
}