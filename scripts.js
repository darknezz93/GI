 $(document).ready(function (){

     $('input:checkbox').click(function() {
         var $box = $(this);
         var num = $(":checkbox:checked").length;
        if(num > 4) {
            $box.prop("checked", false);
            alert("Można wybrać maksymalnie 4 kategorie");
             }
    });

    $("#slider").slider({
        value: 100,
        min: 0,
        max: 500,
        step: 100,
        slide: function (event, ui) {
            $("#amount").val("$" + ui.value);
        }
    });
 
});



