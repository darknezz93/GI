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
		
		updateColorRange(res);

svg.remove();
svg = d3.select("#container")
						.append("svg")
						.attr("width", w)
						.attr("height", h);
						svg.selectAll("path")
				   .data(globalJson)
				   .enter()
				   .append("path")
				   .attr("d", path)
				   .attr("stroke", "rgba(8, 81, 156, 0.2)")
				   //.attr("fill", "rgba(8, 81, 156, 0.6)")
				   .attr("fill", function(d) {
						var val = getPlotValue(res, d.properties.name, 1);
						if (val == null) { 
							return "rgba(8, 81, 156, 0.6)";
						} else{
							return getColorValue(val);
						}})
                   .on("mouseover", function(d,i) {
                        var country = globalJson[i].properties.admin
                        var position = countriesArray.indexOf(country);
                        div.transition()
                        .duration(200)
                        .style("opacity", 0.9);
                        if(position > -1) {
                            div.html("<b>" + country + "</b><br/>" + res[position][1])
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px")
                            .style("visibility", "visible");
                        } else {
                            div.html("").style("visibility", "hidden");
                        }
                    })
                    .on("mouseout", function(d,i) {
                        div.transition()
                        .duration(500)
                        .style("opacity", 0);
                    });
}

