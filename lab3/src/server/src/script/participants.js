$(document).ready(() => {
    
    const updatePage = data => {
        $("tbody").html('');
        data.forEach(item => { //список участников
            $("tbody").append(`
                <tr class="table__row">
                    <td class="table__id table__cell">${item.id}</td>
                    <td class="table-name table__cell">${item.name}</td>
                    <td class="table-capital table__cell">${item.capital}</td>
                    </td><td class="table-address table__cell">${item.address}</td>
                    <td class="table__cell">
                        <div class="table__actions">
                            <button class="button action-change">Изменить</button>
                            <button class="button action-remove">Удалить</button>
                        </div>
                    </td>
                </tr>
            `)
        });
    }

    const start = () => {
        $.get(`${window.location.href}/actual`, data=>{
            updatePage(data);
        });

        $("#participant__form").submit(function(e){
            e.preventDefault();
            const formData = new FormData(e.target);
            const curState = Object.fromEntries(formData);
            console.log($(e.target).attr('data-type'));
            $.ajax({
                type: $(e.target).attr('data-type'),
                url: window.location.href,
                data: JSON.stringify(curState),
                dataType: "json",
                contentType: "application/json",
            })
            .done(res => { //обновляем участников
                $(".modal__form").trigger("reset");
                $("#modal").css("display", "none");
                updatePage(res);
            });
        });

        $(".btn-addItem").on('click', e => { //кнопка добавить участника
            $("#modal").css('display', 'flex');
            $("#participant__form").attr("data-type", "POST");
        });

        $("tbody").on('click', '.action-change', e => { //нажатие изменение участника
            $("#modal").css('display', 'flex');
            $("#participant__form").attr("data-type", "PUT");
            const id = e.target.closest('.table__row').querySelector('.table__id').textContent;
            $.get(`${window.location.href}/${id}`, data=>{
                $("#modal #id").val(data.id);
                $("#modal #name").val(data.name);
                $("#modal #capital").val(data.capital);
                $("#modal #address").val(data.address);
            });
        });

        $("tbody").on('click', '.action-remove', e => { //нажатие на удаление участника
            const id = {id: e.target.closest('.table__row').querySelector('.table__id').textContent};
            $.ajax({
                type: "DELETE",
                url: window.location.href,
                data: JSON.stringify(id),
                dataType: "json",
                contentType: "application/json",
            })
            .done(res => {
                updatePage(res);
            });
        });

        $("#modal").on('click', e => { //закрытие модального окна
            if(e.target.closest('.button__close') || e.target.closest('.cancel-button') || e.target.matches('.modal__overlay')){
                $(".modal__form").trigger("reset");
                $("#modal").css("display", "none");
            }
        });
    }
    start();
});