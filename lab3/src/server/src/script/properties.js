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

