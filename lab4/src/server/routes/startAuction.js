// @flow
//

const properties = require('../json/properties.json');
let paintings = require('../json/db.json');
const owners = require('../json/owners.json');
let participants = require('../json/participants.json');
let { findNameIndex, writeToFile } = require('./functions');

const { Server } = require("socket.io"); //импорт

const io = new Server(); //создание
io.listen(3030);
paintings = paintings.filter(item => item.isInAuction).map(item => {return { ...item, owner: '-', salePrice: '-' }});

const delay = async (ms) => await new Promise(resolve => setTimeout(resolve, ms)); //создание задержки

exports.startAuction = async () => {
    let curPrice = 0, curOwner = '-', curStep = 0, curPainting, timeToStart = (Date.parse(properties.dateStart) - Date.now()) / 1000;
    let index = 0;
    io.on("connection", async socket => { //вешается прослушка на нового клиента
        const timeToWait = Math.floor((Date.parse(properties.dateStart) - Date.now()) / 1000);
        if (timeToWait < 0) {
            socket.emit('info', 'Аукцион уже идет!', 'black'); //на конкретном клиенте провоцируется событие
        }else{
            socket.emit('info', `Аукцион стартует в ${properties.dateStart}; Времени до аукциона: ${Math.floor(timeToWait / 60)} минут ${timeToWait % 60} секунд`, 'black');
        }
        socket.on('offer', (price, name) => {
            if (price > curPrice) {
                curPrice = price;
                curOwner = name;
                curStep++;
                io.emit('curPrice', curPrice); //провоцирует событие на всех клиентах, передает текущую цену
                io.emit('info', `Участник ${name} предложил новую цену ${price}`, 'green'); //выводит в консоль
                io.emit('info', `Текущий шаг: ${curStep}`, 'gray');
                if (curStep === +curPainting.maxStep) {
                    io.emit('info', 'Была сделана последняя ставка. Дождитесь окончания торга.', 'black');
                    io.emit('switchOff'); //выключение кнопки цены
                }
            }
        });
    });

    const setOwner = (curStep, index, owner, curPrice) => { //если картина продана, то устанавливается новый владелец
        if (curStep < paintings[index].minStep) {
            io.emit('info', 'Не было сделано минимальное количество ставок. Картина не продана', 'red');
        }
        else { //если продана
            paintings[index] = { ...paintings[index], owner: owner, salePrice: curPrice } //вписываем владельца и цену
            participants[findNameIndex(participants, owner)].capital -= curPrice; //минус деньги

            io.emit('info', `Картина была продана ${owner}`, 'green');
            io.emit('participantsToAdmin', participants); //отправка админу обновленный список участников без цены за картину
            io.emit('paintingsToAdmin', paintings); //отправка админу текущих картин
            io.emit('reduceBudget', owner, curPrice); //на клиенте уменьшить бюджет

            if(!owners[owner])
                owners[owner] = [];
            owners[owner].push({ name: paintings[index].name, author: paintings[index].author, discription: paintings[index].discription, url: paintings[index].url});
            writeToFile('./server/json/owners.json', JSON.stringify(owners));//добавляем владельцев картин в файл, каждому владельцу добавляем картину
        }
    }

    await delay(timeToStart * 1000);//Ждем начало торгов
    io.emit('info', `Аукцион начался!`);
    for (let painting of paintings) { //по всем картинам
        curPainting = painting;
        curPrice = painting.startPrice;
        io.emit('curPrice', curPrice); //текущая цена
        io.emit('info', `Картина: ${painting.name}, начальная цена: ${painting.startPrice}, минимальный количество ставок: ${painting.minStep}, максимальное количество: ${painting.maxStep}, время на торг: ${properties.intervalEnd} минуты`, 'black bold');
        io.emit('painting', painting); //текущая картина отправляется всем
        io.emit('info', `У вас ${properties.intervalResearch} минута на изучение картины`, 'black');
        await delay(properties.intervalResearch * 60 * 1000); //Запускаем время на осмотр картины
        io.emit('info', `Торг начался! У вас ${properties.intervalEnd} минуты`, 'black');
        io.emit('switchOn'); //включаем кнопку
        await delay(properties.intervalEnd * 60 * 1000); //Ждем окончание торга
        io.emit('switchOff'); //выключаем
        io.emit('info', `Время торга вышло!`, 'black');
        setOwner(curStep, index, curOwner, curPrice); //устанавливаем нового владельца
        io.emit('info', `У вас ${properties.intervalBetween} минута на отдых`, 'black');
        await delay(properties.intervalBetween * 60 * 1000); //Отдых между торгами
        curOwner = '-';
        curStep = 0;
        index++;//следующая картина
    };
    io.emit('info', 'Торг по картинам окончен!', 'green bold');
}