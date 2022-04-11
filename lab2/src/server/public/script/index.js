document.addEventListener("DOMContentLoaded", () => {
    const makeRequest = (typeOfReq = "GET", distination = "/booksList", body) => { //ajax (fetch)
        if(typeOfReq === "GET"){ //get
            return fetch(distination);
        } else if (typeOfReq === "DELETE"){ //delete
            return fetch(distination, {method: typeOfReq});
        }
        else {
            return fetch(distination, { //post/put
                method: typeOfReq,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: body
            });
        }
    };

    const toDate = (string) => {
        const array = string.split('.');
        return new Date(+array[2], +array[1], +array[0]);
    }

    const getData = async () => { //принимает исходный массив
        const resp = await makeRequest(); //пока не выполнится
        if (resp.ok) {
            return await resp.json();
        } else {
            alert("Ошибка HTTP: " + resp.status);
            return;
        }
    }

    const updatePage = data => { //обновление страницы
        const tbody = document.querySelector('tbody');
        tbody.textContent = "";
        data.forEach(item => { //новая верстка
            tbody.insertAdjacentHTML('beforeend', `
            <tr class="table__row">
                <td class="table__id table__cell">${item.id}</td>
                <td class="table-author table__cell">${item.author}</td>
                <td class="table-name table__cell">${item.name}</td>
                <td class="table-release table__cell">${item.releaseDate}</td>
                <td class="table-availability table__cell">${item.inLibrary}</td>
                <td class="table-return table__cell 
                    ${item.inLibrary === "no" && item.returnDate && toDate(item.returnDate < Date.now() 
                        ? 'expired' : '')}"> 
                    ${item.inLibrary === "no" && item.returnDate ? item.returnDate : '--'}
                </td>
                <td class="table__cell">
                    <div class="table__actions">
                        <button class="button action-remove">
                            <span class="svg_ui">
                                <svg class="action-icon_remove"><use xlink:href="../public/img/sprite.svg#remove"></use></svg>
                            </span>
                            <span>Удалить</span>
                        </button>
                    </div>
                </td>
            </tr>
            `);
        });
    }

    const start = async () => {
        let data = await getData(); //принимает данные (пока не выполнится)
        const filterSelect = document.getElementById("filterType");
        filterSelect.addEventListener("change", async e => { //получаем новые данные от фильтра
            let newData = await makeRequest("GET", `/filter/${e.target.value}`) //отправляем на сервер
            newData = await newData.json();
            updatePage(newData);
        });

        const tbody = document.querySelector("tbody");
        tbody.addEventListener('click', async e => {
            let target = e.target.closest(".action-remove");
            if(target){ //удаление
                if(!confirm("Вы уверены, что хотите удалить этот элемент?")){
                    return;
                }
                const id = target.closest(".table__row").querySelector(".table__id").textContent; //получение id (какую строку удалить)
                data = await makeRequest("DELETE", `/booksList/${id}`);
                data = await data.json(); //обновленные данные
                updatePage(data); //обновление страницы
            } else {
                target = e.target.closest('.table__row');
                if(target){ //если открыть строчку - карточка книги
                    window.location.href = `/booksList/${target.querySelector('.table__id').textContent}`; //перевод на страницу книги
                }
            }
        });

        const modal = document.getElementById('modal'); //модальное окно
        modal.addEventListener('click', e => { //закрываем окно
            if(e.target.closest('.button__close') || e.target.closest('.cancel-button') || e.target.matches('.modal__overlay')){
                modal.querySelector('form').reset();
                modal.style.display = "none";
            }
        });

        const addBtn = document.querySelector(".btn-addItem"); //открытие модального окна
        addBtn.addEventListener('click', () => modal.style.display = 'flex');

        const form = document.querySelector("form"); //форма
        form.addEventListener('submit', async e => {
            e.preventDefault();
            modal.style.display = "none";
            let formData = new FormData(e.target); //все данные формы
            formData = JSON.stringify(Object.fromEntries(formData)); //переводим в формат json
            data = await makeRequest("POST", "/", formData); //отправляем на сервер
            data = await data.json(); //новый список данных с добавленной книгой
            updatePage(data);
            form.reset();
        });
        filterSelect.dispatchEvent(new Event("change"));
    }

    start();

});