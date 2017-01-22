 $(document).ready(function (){
     
     //domyslnie populacja
     $("#przychody").prop("checked", true);
     $('#barChart').hide();

     $('input:checkbox').click(function() {
        var $box = $(this);
        var num = $(":checkbox:checked").length;
        if(num > 1) {
            //$box.prop("checked", false);
            //alert("Można wybrać maksymalnie 1 kategorię");
            if($box.is(":checked")) {
                categories.push($box.attr('id'))
            } else {
                var index = categories.indexOf($box.attr('id'));
                if (index > -1) {
                    categories.splice(index, 1);
                }
            }
            $('#container').hide();
            $('#barChart').show();
        } else {
            if($box.is(":checked")) {
                categories = [$box.attr('id')];
            } else {
                var index = categories.indexOf($box.attr('id'));
                if (index > -1) {
                    categories.splice(index, 1);
                }
            }
            
            $('#container').show();
            $('#barChart').hide();
        }
        updateResource(); 

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
    
        var tempRes = [];
    
        for(var i = 0; i < res.length; i++) {
            res[i] = res[i].splice(0, 1);
        }
        
        for(var i = 0; i < categories.length; i++) {
            if(categories[i] == "populacja") {
                tempRes = getData(FILE_POPULACJA, countriesArray, [year]);
            } else if(categories[i] == "inflacja") {
                tempRes = getData(FILE_INFLACJA, countriesArray, [year]);
            } else if(categories[i] == "deficyt") {
                tempRes = getData(FILE_DEFICYT_BUDZETOWY, countriesArray, [year]);
            } else if(categories[i] == "przychody") {
                tempRes = getData(FILE_PRZYCHODY_RZADU, countriesArray, [year]);
            } else if(categories[i] == "socjal") {
                tempRes = getData(FILE_WYDATKI_OPIEKA_SOCJALNA, countriesArray, [year]);
            } else if(categories[i] == "wydatki") {
                tempRes = getData(FILE_WYDATKI_RZADU, countriesArray, [year]);
            } else if(categories[i] == "pkb") {
                tempRes = getData(FILE_WZROST_PKB, countriesArray, [year]);
            } 
            for(var j = 0; j < tempRes.length; j++) {
                res[j].push(tempRes[j][1]);
            }
        }
        //console.log(res);

		
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
    

    initializeBarChart(true);
}



function initializeBarChart(remove) {
    var n = 29; // number of samples
    var mm = 4;

    var data = d3.range(m).map(function() { return d3.range(n).map(Math.random); });
        
    var charBarData = [];
    
    
    for(var i = 1; i < res[0].length; i++) {
        charBarData[i-1] = [];
        for(j = 0; j < res.length; j++) {
            charBarData[i-1][j] = parseFloat(res[j][i]);
        }
    }   
    
    var m = charBarData.length;
        
    var maxValue = getMaxValue(charBarData);
    //console.log(maxValue);
    //console.log(d3.range(n));
    //console.log(res);

    var margin = {top: 20, right: 30, bottom: 30, left: 90},
        width = 1650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var y = d3.scale.linear()
        .domain([0, maxValue])
        .range([height, 0]);

    var x0 = d3.scale.ordinal()
        .domain(countriesArray)
        .rangeBands([0, width], .2);

    var x1 = d3.scale.ordinal()
        .domain(d3.range(m))
        .rangeBands([0, x0.rangeBand()]);

    var z = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    
    if(remove) {
        $("#barChart").html("");
    }
    

    svg1 = d3.select("#barChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("svg1:g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg1.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    svg1.append("g").selectAll("g")
        .data(charBarData)
    .enter().append("g")
        .style("fill", function(d, i) { return z(i); })
        .attr("transform", function(d, i) { return "translate(" + x1(i) + ",0)"; })
    .selectAll("rect")
        .data(function(d) { return d; })
    .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("height", y)
        .attr("x", function(d, i) { return x0(countriesArray[i]); })
        .attr("y", function(d) { return height - y(d); });
            
}



function getMaxValue(charBarData) {
    var values = []
    for(var i = 0; i < charBarData.length; i++) {
        values[i] = Math.max.apply(Math, charBarData[i]);
    }
    return Math.max.apply(Math, values);
}


