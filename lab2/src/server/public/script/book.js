document.addEventListener('DOMContentLoaded', () => {
    const makeRequest = (typeOfReq = "GET", distination = "/booksList", body) => {
        if(typeOfReq === "GET"){
            return fetch(distination);
        } else if (typeOfReq === "DELETE"){
            if(confirm("Вы уверены, что хотите удалить этот элемент?"))
                return fetch(distination, {method: typeOfReq});
            else
                return new Promise((res, rej) => {});
        }
        else {
            return fetch(distination, {
                method: typeOfReq,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: body
            });
        }
    };

    const start = () => {
        const form = document.getElementById("bookForm"),
            cancelBtn = document.getElementById("cancel"),
            returnBtn = document.getElementById("return"),
            giveBookBtn = document.getElementById("giveBook"),
            returnBookBtn = document.getElementById("returnBook"),
            modal = document.getElementById("modal"),
            modalForm = modal.querySelector('.modal__form'),
            availabilityInp = form.querySelector("[name='inLibrary']"),
            readerNameInp = form.querySelector("[name='readerName']"),
            returnDateInp = form.querySelector("[name='returnDate']");
        let curState = Object.fromEntries(new FormData(form)), refresh = true;

        const checkAvailability = () => { //наличие книги
            if(availabilityInp.value === "yes"){
                giveBookBtn.style.display = "block";
                returnBookBtn.style.display = "none";
            } else {
                giveBookBtn.style.display = "none";
                returnBookBtn.style.display = "block";
            }
        }

        form.addEventListener('change', e => {
            if(e.target.tagName === "INPUT"){
                refresh = false;
            }
        });
        form.addEventListener('submit', async e => {
            e.preventDefault();
            if(refresh){
                return;
            }
            const formData = new FormData(e.target);
            curState = Object.fromEntries(formData); //собираем данные
            refresh = true;
            await makeRequest("PUT", document.URL, JSON.stringify(curState)); //отправляем на сервер
            document.title = form.querySelector("[name='name']").value; //если поменялось названием - меняем заголовок страницы
            document.querySelector('.title').textContent = form.querySelector("[name='name']").value;
        });

        cancelBtn.addEventListener('click', e => { //меняем на старые данные (кнопка отмены)
            e.preventDefault();
            form.querySelectorAll("input").forEach(item => {
                item.value = curState[item.name];
            });
            checkAvailability();
            refresh = true;
        });

        returnBtn.addEventListener('click', e => {
            e.preventDefault();
            if(!refresh){
                if(confirm("У вас остались несохраненные изменения. Все равно покинуть страницу?"))
                    window.location.href = '/';
            } else
                window.location.href = '/';
        });

        giveBookBtn.addEventListener('click', e => { //открывает модальное окно
            e.preventDefault();
            modal.style.display = "flex";
            checkAvailability();
        });

        returnBookBtn.addEventListener('click', e => {
            e.preventDefault();
            availabilityInp.value = "yes";
            readerNameInp.value = "";
            returnDateInp.value = "";
            refresh = false;
            checkAvailability();
        });

        modalForm.addEventListener('submit', e => { //окно на выдачу книги
            e.preventDefault();
            refresh = false;
            availabilityInp.value = "no";
            returnDateInp.value = modalForm.querySelector("[name='returnDate']").value;
            readerNameInp.value = modalForm.querySelector("[name='readerName']").value;
            checkAvailability();
            modalForm.reset();
            modal.style.display = "none";
        });
        modal.addEventListener('click', e => { //закрытие модального окна
            if(e.target.closest('.button__close') || e.target.closest('.cancel-button') || e.target.matches('.modal__overlay')){
                modalForm.reset();
                modal.style.display = "none";
            }
        });
    }
    start();
});