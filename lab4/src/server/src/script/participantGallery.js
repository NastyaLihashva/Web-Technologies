//галерея картин
require('jquery');
require('../less/participantGallery.less');

const Rollbar = require("rollbar");
const rollbar = new Rollbar({
    accessToken: '92740abcd604480392f0f1ffe07e5344',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: 'production'
    }
});

$(document).ready(() => { //получаем данные из сервера и обновляем
    $.get(`${window.location.href}/data`, (paintings) => {
        $('.paintings__wrapper').html('');
        paintings.forEach(painting => {
            $('.paintings__wrapper').append(`
                <div class="paintings__item">
                    <div class="paintings__content">
                        <img class="paintings__img" src="../..${painting.url}" alt="${painting.name}">
                    </div>
                    <div class="paintings__text"> 
                        <h3 class="paintings__name">${painting.name}</h3>
                        <h4 class="paintings__author">${painting.author}</h4>
                        <p class="paintings__discription">${painting.discription}</p>
                    </div>
                </div>
            `)
        });
    })
    .fail(err => {
        rollbar.error(err);
    });
});