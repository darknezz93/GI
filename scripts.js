 $(document).ready(function (){
     
     //domyslnie populacja
     $("#populacja").prop("checked", true);

     $('input:checkbox').click(function() {
        var $box = $(this);
        var num = $(":checkbox:checked").length;
        if(num > 1) {
            $box.prop("checked", false);
            alert("Można wybrać maksymalnie 1 kategorię");
        } else {
            category = $box.attr('id');
            updateResource(); 
        }
    
    });

    $("#slider").slider({
        value: 2011,
        min: 2010,
        max: 2015,
        step: 1,
        slide: function (event, ui) {
            year = ui.value;
            updateResource();
        }
    });
 
});

function updateResource() {
        if(category == "populacja") {
            res = getData(FILE_POPULACJA, countriesArray, [year]);
        } else if(category == "inflacja") {
            res = getData(FILE_INFLACJA, countriesArray, [year]);
        } else if(category == "deficyt") {
            res = getData(FILE_DEFICYT_BUDZETOWY, countriesArray, [year]);
        } else if(category == "przychody") {
            res = getData(FILE_PRZYCHODY_RZADU, countriesArray, [year]);
        } else if(category == "socjal") {
            res = getData(FILE_WYDATKI_OPIEKA_SOCJALNA, countriesArray, [year]);
        } else if(category == "wydatki") {
            res = getData(FILE_WYDATKI_RZADU, countriesArray, [year]);
        } else if(category == "pkb") {
            res = getData(FILE_WZROST_PKB, countriesArray, [year]);
        }
}

