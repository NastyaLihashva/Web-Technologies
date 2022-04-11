require('../less/properties.less');
require('jquery');
require('webpack-jquery-ui/css');

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
    $("#properties__form").submit((e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const curState = Object.fromEntries(formData);
        $.ajax({
            type: "POST",
            url: window.location.href,
            data: JSON.stringify(curState),
            dataType: "json",
            contentType: "application/json",
        })
    });

   $.get(`${window.location.href}/actual`, data=>{
        $(".input").each(function (indexInArray, valueOfElement) {
            if(data[$(valueOfElement).attr('name')]) 
                valueOfElement.value = data[$(valueOfElement).attr('name')];
        });
    });
    
});

