"use strict";
$(document).ready(() => {
    const idGenerator = () => '_' + Math.random().toString(36).substr(2, 9);
    const updatePage = (data) => {
        const wrapper = $(".paintings__wrapper").html('');
        data.forEach(painting => { //новая верстка
            const discription = painting.discription.slice(0, 250) + "...";
            wrapper.append(`
            <div class="paintings__item ${painting.isInAuction ? '' : 'paintings__item_excluded'}" id=${painting.id}>
                <div class="paintings__content">
                    <img class="paintings__img" src="${painting.url}" alt="${painting.name}">
                </div>
                <div class="paintings__text"> 
                    <h3 class="paintings__name">${painting.name}</h3>
                    <h4 class="paintings__author">${painting.author}</h4>
                    <p class="paintings__discription">${discription}</p>
                </div>
            </div>
            `);
        });
    }
    const start = () => {
        $.get(window.location.href + "/actual", data => {
            updatePage(data);
        });
        $(".paintings__wrapper").on('click', '.paintings__item', function(e){
            const id = this.id;
            window.location.href = `/paintingsList/${id}`;  //переход к картине по id
        });
        $(".main__btn").on('click', () => {
             window.location.href = `/paintingsList/${idGenerator()}`; //при создании картины переходит к новой картине с рандомным id
        });
    }
    start();
});