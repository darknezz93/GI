colorRangeMax = 1;
colorRangeMin = 0;

function updateColorRange(data){
	if(data.length>0){
		var currMin = parseFloat(data[0][1]);
		var currMax = parseFloat(data[0][1]);
		for(var i=0; i<data.length; i++){
			for(var j=1; j<data[0].length; j++){
				if(parseFloat(data[i][j])<currMin){
					currMin = parseFloat(data[i][j]);
				}
				if(parseFloat(data[i][j])>currMax){
					currMax = parseFloat(data[i][j]);
				}
			}
		}
		setColorRange(currMin, currMax);
	}
}

function getPlotValue(data, country, column){
	for(var i=0; i<data.length; i++){
		if(data[i][0]==country){
			return data[i][column];
		}
	}
}

function setColorRange(min, max){
	colorRangeMin = min;
	colorRangeMax = max;
}

function getColorValue(val){
	/*var fVal = parseFloat(val);
	if (fVal > colorRangeMax) {
            fVal = colorRangeMax;
        }
        else if (fVal < colorRangeMin) {
            fVal = colorRangeMin;
        }
		fVal = (fVal/colorRangeMax) * 100;
        
        var h= Math.floor((100 - fVal) * 120 / 100);
        var s = Math.abs(fVal - 50)/50;
        var v = 1;
        
        return hsv2rgb(h, s, v)
        */
		return hsl_col_perc((1-val/colorRangeMax)*100, 0, 120);
}

function hsl_col_perc(percent,start,end) {

     var a = percent/100,
     b = end*a;
     c = b+start;

    //Return a CSS HSL string
    return 'hsl('+c+',100%,50%)';
}

var hsv2rgb = function(h, s, v) {
  // adapted from http://schinckel.net/2012/01/10/hsv-to-rgb-in-javascript/
  var rgb, i, data = [];
  if (s === 0) {
    rgb = [v,v,v];
  } else {
    h = h / 60;
    i = Math.floor(h);
    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
    switch(i) {
      case 0:
        rgb = [v, data[2], data[0]];
        break;
      case 1:
        rgb = [data[1], v, data[0]];
        break;
      case 2:
        rgb = [data[0], v, data[2]];
        break;
      case 3:
        rgb = [data[0], data[1], v];
        break;
      case 4:
        rgb = [data[2], data[0], v];
        break;
      default:
        rgb = [v, data[0], data[1]];
        break;
    }
  }
  return '#' + rgb.map(function(x){
    return ("0" + Math.round(x*255).toString(16)).slice(-2);
  }).join('');
};