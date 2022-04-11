const express = require("express");
const path = require("path");
const properties = require('./json/properties.json');
let stocks = require('./json/stocks.json');
const brokers = require('./json/brokers.json');
let { findNameIndex, writeToFile } = require('./routes/functions');

const { startAuction } = require('./routes/start');

const { Server } = require("socket.io");

const io = new Server();

const app = express();
app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());

let flag = false;

app.listen(3080);

io.on('connection', socket => {
    if(!flag){
        socket.emit('info', 'Администратор еще не начал аукцион');
    } else{
        const endTime = Math.floor((Date.parse(properties.end) - Date.now()))
        const timeToWait = Math.floor((Date.parse(properties.start) - Date.now()) / 1000);
        if(endTime < 0){
            socket.emit('info', 'Аукцион уже закончился!');
            socket.emit('canBuy', false);
        }else{
            socket.emit('brokers', brokers); //когда аукцион начался
            socket.emit('stocksUpload', stocks);
            socket.emit('canBuy', true); //разрешаем покупать
            if (timeToWait < 0) {
                socket.emit('info', 'Аукцион уже идет!');
            } else {
                socket.emit('info', `Аукцион стартует в ${properties.dateStart}; Времени до аукциона: ${Math.floor(timeToWait / 60)} минут ${timeToWait % 60} секунд`);
            }
        }
    }
    socket.on('startAuc', () => { flag = true; startAuction(io); });

    socket.on('offer', ({ amount, name, broker }) => {
        let indexStock = findNameIndex(stocks, name);
        stocks[indexStock].amount -= amount;
        const indexBrok = findNameIndex(brokers, broker);
        brokers[indexBrok].budget -= amount * stocks[indexStock].curPrice;
        brokers[indexBrok][name] += amount;

        writeToFile('./server/json/stocks.json', stocks);
        writeToFile('./server/json/brokers.json', brokers);

        io.emit('brokersToAdmin', brokers); //сообщаем серверу об изменении в состоянии Брокеров
        socket.emit('brokers', brokers);
        io.emit('stocksUpload', stocks); //сообщаем всем об изменении в состянии акций
    });

    socket.on("changeDistribution", (name, value) => {
        const index = findNameIndex(stocks, name);
        stocks[index].distribution = value;
        writeToFile('./server/json/stocks.json', stocks);
        io.emit('stocksUpload', stocks);
    });
});




io.listen(3030);
