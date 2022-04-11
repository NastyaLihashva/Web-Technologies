// @flow
//страница с меню
require('../less/index.less');
require('jquery');

const Rollbar = require("rollbar");
const rollbar = new Rollbar({
    accessToken: '92740abcd604480392f0f1ffe07e5344',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: 'production'
    }
});

$(document).ready(() => {
    $('#enter').on('click', () => { //открытие всплывающих окон
        $('#modal').css('display', 'flex');
    });

    $('#participant__form').submit(e => {
        e.preventDefault();
        const name = $('#name').val();

        $.ajax({
            type: 'POST',
            url: './',
            data: JSON.stringify({'name': name}),
            dataType: "json",
            contentType: "application/json"
        })
        .done(res => { //проверка на сущестования клиента
            if(res.name){
                window.location.href = `${window.location.href}participant/${res.name}`;
            } else{
                alert(`Пользователя с именем ${name} не зарегистрирован`);
                $('#participant__form').trigger("reset");
            }
            rollbar.log("Данные были успешно переправлены на сервер");
        })
        .fail(err => {
            rollbar.error(err);
        });
    });

    $("#modal").on('click', e => {
        if (e.target.closest('.button__close') || e.target.closest('.cancel-button') || e.target.matches('.modal__overlay')) {
            $(".modal__form").trigger("reset");
            $("#modal").css("display", "none");
        }
    });
});
