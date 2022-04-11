$(document).ready(() => {
    const updatePage = (data = {}) => {
        $(".title").text(data.name ? data.name : 'Новая картина'); //форма для новой картины
        $(".form").html(`
            <div class="form__about">
                <label class="label">Название картины<input class="input" id="form__name" value="${data.name ? data.name : ''}" name="name" type="text" required></label>
                <label class="label">Автор<input class="input" id="form__author" value="${data.author ? data.author : ''}" name="author" type="text" required></label>
                <label class="label">Описание<textarea class="input textarea" id="form__discription" name="discription" cols="30" rows="10" required>${data.discription ? data.discription : ''}</textarea></label>
                <label class="label">Ссылка на картинку<input class="input" id="form__url" value="${data.url ? data.url : ''}" name="url" required></label>
            </div>
            <div class="form__auction">
                <label class="label">Участие в аукционе<input class="input" id="form__isInAuction" type="checkbox" ${data.isInAuction ? 'checked' : ''} name="isInAuction"></label>
                <label class="label">Начальная цена<input class="input" id="form__startPric" value=${data.startPrice ? data.startPrice : 0} name="startPrice" type="number" required></label>
                <label class="label">Минимальное количество шагов<input class="input" id="form__minStep" value=${data.minStep ? data.minStep : 1} name="minStep" type="number" required></label>
                <label class="label">Максимальное количество шагов<input class="input" id="form__maxStep" value="${data.maxStep ? data.maxStep : 1}" name="maxStep" type="number" required></label>
            </div>
        `);
        $(".main__img").html(`
            <img src="${data.url ? data.url : '/public/img/paintings/undef.jpg'}" alt="${data.name ? data.name : ''}">
        `)
    }

    const start = () => {
        $.get(`${window.location.href}/actual`, data => {
            updatePage(data);
            if($.isEmptyObject(data)){
                $("#painting__form").attr('data-type', "POST"); //если картины нет, то добавляем
                $(".btn__accept").text("Добавить картину");
            } else {
                $("#painting__form").attr('data-type', "PUT"); //если есть, то обновляем
            }
        });
        
        $("#painting__form").submit(function(e) { //отправка формы
            e.preventDefault();
            const curState = Object.fromEntries(new FormData(e.target));
            curState['isInAuction'] === 'on' ? curState['isInAuction'] = true : curState['isInAuction'] = false;
            $.ajax({ //обрабатываем ответ от сервера
                type: $(e.target).attr('data-type'),
                url: window.location.href,
                data: JSON.stringify(curState), //данные отправляемые на сервер
                dataType: "json", //тип данных
                contentType: "application/json",
            })
            .done(res => { //обработчик при успешном выполнении
                alert("Данные успешно обновлены");
                $(".title").text($("#form__name").val());
                $(".main__img").html(`
                    <img src="${curState.url}" alt="${curState.name}">
                `);
                $("#painting__form").attr('data-type', "PUT");
                $(".btn__accept").text("Сохранить изменения");
            })
            .fail(res => {
                console.log(res);
                alert("Ошибка");
            });
        });
        $("#btn__delete").on('click', e => {
            e.preventDefault();
            $.ajax({
                type: "DELETE",
                url: window.location.href,
            })
            .done(res => {
                window.location.href = '/';
            })
            .fail(res => {
                alert("Ошибка");
            });
        });

        $("#upload__form").submit((e) => { //загружаем форму
            e.preventDefault();
            const data = new FormData(e.target);
            $.ajax({
                type: "POST",
                url: '/upload',
                data: data,
                contentType: false,
                processData: false,
                success: () => {
                    if($('#file').prop('files')){
                        $(".main__img").html(`
                            <img src="/public/img/paintings/${$('#file').prop('files')[0].name}" alt="">
                        `);
                        $("#form__url").val(`/public/img/paintings/${$('#file').prop('files')[0].name}`);
                    }
                }
            });

        });
    }
    start();

});