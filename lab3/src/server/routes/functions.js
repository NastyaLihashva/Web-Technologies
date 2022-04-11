const fs = require("fs");

exports.idGenerator = () => '_' + Math.random().toString(36).substr(2, 9); //генерация id

exports.findIdItem = (paintings, id) => { //поиск картин
    for(let i = 0; i < paintings.length; i++){
        if(paintings[i].id === id){
            return paintings[i];
        }
    }
    return {};
}

exports.findIdIndex = (paintings, id) => {  //поиск индекса
    for(let i = 0; i < paintings.length; i++){
        if(paintings[i].id === id)
            return i;
    }
    return -1;
};

exports.writeToFile = (file = './server/db.json', paintingJson) => {  //запись в базу данных
    try{
        fs.writeFile(file, paintingJson, (err) => {
            if (err) throw err;
            console.log('База данных успешно обновлена');
        });
    } catch (err) {
        console.error(err);
    }
}

exports.sortAuction = (a, b) => { //сортировка по участию в аукционе
    if(b.isInAuction)
        return 1;
    return -1;
}

