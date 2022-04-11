const properties = require('../json/properties.json');
let stocks = require('../json/stocks.json');
const brokers = require('../json/brokers.json');


const delay = async (ms) => await new Promise(resolve => setTimeout(resolve, ms));

const gaussianRand = () => { //для нормального распределения
    var rand = 0;

    for (var i = 0; i < 6; i += 1) {
        rand += Math.random();
    }

    return rand / 6;
}

const gaussianRandomInt = (start, end) => {
    return Math.floor(start + gaussianRand() * (end - start + 1));
}

function randomInteger(min, max) { //для равномерного распределения
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}


const normal = (stock) => {
    return gaussianRandomInt(stock.min, stock.max);
}

const uniform = (stock) => {
    return randomInteger(stock.min, stock.max);
}

exports.startAuction = async (io) => { //когда начинается аукцион
    let canBuy = false;
    let start = (Date.parse(properties.start) - Date.now());
    const changePrices = () => {
        for (let i = 0; i < stocks.length; i++) {
            if (stocks[i].distribution === "normal") {
                stocks[i].curPrice = normal(stocks[i]);
            }
            else {
                stocks[i].curPrice = uniform(stocks[i]);
            }
        }
        io.emit('stocksUpload', stocks);
    }
    const timeToWait = Math.floor((Date.parse(properties.start) - Date.now()) / 1000);
    if (timeToWait < 0) {
        io.emit('info', 'Аукцион уже идет!');
    } else {
        io.emit('info', `Аукцион стартует в ${properties.dateStart}; Времени до аукциона: ${Math.floor(timeToWait / 60)} минут ${timeToWait % 60} секунд`);
    }
    io.emit('brokers', brokers);
    io.emit('stocksUpload', stocks);
    io.emit('canBuy', canBuy);

    await delay(start); //ждем начало

    io.emit('info', 'Аукцион начался! Покупайте акции!');
    canBuy = true;
    io.emit('canBuy', canBuy);

    changePrices();

    const intervalId = setInterval(() => { //каждый интервал обновляем цены
        if (Date.now() >= Date.parse(properties.end)) { //закончился аукцион
            clearInterval(intervalId);
            io.emit('info', 'Аукцион закончился! Спасибо за участие!');
            canBuy = false;
            io.emit('canBuy', canBuy);
        }
        else {
            changePrices();
        }
    }, properties.interval * 60 * 1000);
}