var selectedCountries = []

$(document).ready(function (){
     
     //domyslnie populacja
     $("#przychody").prop("checked", true);
     //$("#Austria").prop("checked", true);
     $('#barChart').hide();

     $('input:checkbox').click(function() {
        
        var $box = $(this);
         
        //var selectedCountries = [];
         
        $('#countriesCheckboxes input:checked').each(function() {
            var id = $(this).attr('id');
            if($(this).is(":checked")) {
                if(selectedCountries.indexOf(id) == -1) {
                    selectedCountries.push($(this).attr('id'));
                }
            }
        });
         
        $('#countriesCheckboxes input:not(:checked)').each(function() {
            var id = $(this).attr('id');
            var index = selectedCountries.indexOf(id);
            if (index > -1) {
                selectedCountries.splice(index, 1);
            }
        });
         
        $('#countriesCheckboxes input:not(:checked)').each(function() {
            var index = selectedCountries.indexOf($box.attr('id'));
        });
        var num = $(":checkbox:checked").length - selectedCountries.length;
        //console.log(num);
         
        if($('#liniowy').prop('checked') && num > 2) {
            alert("Wykres liniowy pozwala na wybór tylko jednej kategorii");
            $(this).attr('checked', false); 
        } else if(num > 1 && selectedCountries.length == 0) {
            //$box.prop("checked", false);
            if($box.parent()[0].parentElement.className == 'checkboxes' && $box.is(":checked")) {
                console.log("CHUJ1");
                categories.push($box.attr('id'))
            } else if($box.parent()[0].parentElement.className == 'checkboxes' && !$box.is(":checked")) {
                console.log("CHUJ2");
                var index = categories.indexOf($box.attr('id'));
                if (index > -1) {
                    categories.splice(index, 1);
                }
            }
            $('#container').hide();
            $("#lineChart").hide();
            $('#lineChart').siblings('#countriesCheckboxes').hide();
            $('#barChart').show();
        } else if(selectedCountries.length > 0) {
            if($box.parent()[0].parentElement.className == 'checkboxes' && $box.is(":checked")) {
                console.log("CHUJ3");
                categories = [$box.attr('id')]
            } else if($box.parent()[0].parentElement.className == 'checkboxes' && !$box.is(":checked")) {
                console.log("CHUJ4");
                var index = categories.indexOf($box.attr('id'));
                if (index > -1) {
                    categories.splice(index, 1);
                }
            }
        } else {
            if($box.is(":checked")) {
                console.log("CHUJ5");
                categories.push($box.attr('id'));
            } else {
                console.log("CHUJ6");
                var index = categories.indexOf($box.attr('id'));
                if (index > -1) {
                    categories.splice(index, 1);
                }
            }
            
            $('#container').show();
            $('#slider').show();
            $('#barChart').hide();
            $("#lineChart").hide();
            $('#lineChart').siblings('#countriesCheckboxes').hide();
            $('#liniowy').prop('checked', false);
        }
         
        updateResource();
         
        console.log(categories);
        console.log(selectedCountries);

    });
     
     
     $('#liniowy').click(function(){
        if(this.checked == true) {
            $('#container').hide();
            $('#barChart').hide();
            $('#checkboxes').hide();
            $("#lineChart").show();
            $('#lineChart').siblings('#countriesCheckboxes').show();
            $('#slider').hide();
        } else {
			countriesArray = allCountries;
            $('#container').show();
            $('#checkboxes').show();
            $("#lineChart").hide();
            $('#lineChart').siblings('#countriesCheckboxes').hide();
            $('#barChart').hide();
            $('#slider').show();
        }
        updateResource(true); 
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

function updateResource(firstOpenLineChart) {
    
        var tempRes = [];
    
        for(var i = 0; i < res.length; i++) {
            res[i] = res[i].splice(0, 1);
        }
		
		if($('#liniowy').prop('checked')){
			var years = [2010, 2011, 2012, 2013, 2014, 2015]
			if(categories[0] == "populacja") {
					res = getData(FILE_POPULACJA, countriesArray, years);
				} else if(categories[0] == "inflacja") {
					res = getData(FILE_INFLACJA, countriesArray, years);
				} else if(categories[0] == "deficyt") {
					res = getData(FILE_DEFICYT_BUDZETOWY, countriesArray, years);
				} else if(categories[0] == "przychody") {
					res = getData(FILE_PRZYCHODY_RZADU, countriesArray, years);
				} else if(categories[0] == "socjal") {
					res = getData(FILE_WYDATKI_OPIEKA_SOCJALNA, countriesArray, years);
				} else if(categories[0] == "wydatki") {
					res = getData(FILE_WYDATKI_RZADU, countriesArray, years);
				} else if(categories[0] == "pkb") {
					res = getData(FILE_WZROST_PKB, countriesArray, years);
				} 
		} else {
					
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
    initializeLineChart(firstOpenLineChart);
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


function initializeLineChart(firstOpen){
	$("#lineChart").html("");
    years1 = [2010, 2011, 2012, 2013, 2014, 2015];
	//var res1 = getData(FILE_PRZYCHODY_RZADU, countriesArray, years1);
	//console.log(res);
	var myData = [];
	var min = res[0][1];
	var max = res[0][1];
    var rength = 0;
    
    //$("#Austria").prop("checked", true);
    
    var myDataIndex = 0;
    
    var tempRes = [];
    for(var i = 0; i < res.length; i++) {
        if(selectedCountries.includes(res[i][0])) {
            tempRes.push(res[i]);
        }
    }
    
    if(firstOpen) {
       length = 1;
    } else {
        length = tempRes.length;
    }
    
    //console.log(tempRes);
    
	for(var i=0; i<length; i++){
		var myDataLocalRow = []
		var rowName = tempRes[i][0]
		for(var j =1; j<tempRes[i].length; j++){
            //console.log(res[i]);
                myDataLocalRow[j-1] = {
				"sale":tempRes[i][j],
				"year":years1[j-1],
				"name":rowName
			};
			if(tempRes[i][j]>max){
				max = tempRes[i][j];
			}
			if(tempRes[i][j]<min){
				min = tempRes[i][j];
			}
            //console.log(myDataLocalRow);
			myData[i] = myDataLocalRow;
            myDataIndex++;
		}
	}
    //console.log(myData);
                    vis = d3.select("#lineChart"),
					
                        WIDTH = 1000,
                        HEIGHT = 500,
                        MARGINS = {
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 50
                        },
						
                        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([2010, 2015]),
                        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([min, max]),

                        xAxis = d3.svg.axis()
                        .scale(xScale),
                        yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left");
                    vis.append("svg:g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
                        .call(xAxis);
                    vis.append("svg:g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
                        .call(yAxis);
                    var lineGen = d3.svg.line()
                        .x(function(d) {
                            return xScale(d.year);
                        })
                        .y(function(d) {
                            return yScale(d.sale);
                        })
                        .interpolate("basis");
					var color = d3.scale.category20();
					for(var k=0; k<myData.length; k++){
						vis.append('svg:path')
							.attr('d', lineGen(myData[k]))
							.attr('stroke', color(k))
							.attr('stroke-width', 2)
							.attr('fill', 'none');
					}

                    //vis.append('svg:path')
                    //    .attr('d', lineGen(data2))
                    //    .attr('stroke', 'blue')
                    //    .attr('stroke-width', 2)
                    //    .attr('fill', 'none');

}




function getMaxValue(charBarData) {
    var values = []
    for(var i = 0; i < charBarData.length; i++) {
        values[i] = Math.max.apply(Math, charBarData[i]);
    }
    return Math.max.apply(Math, values);
}


