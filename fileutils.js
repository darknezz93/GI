const FILES_DIR = "http://localhost:8000/data/";
const FILE_POPULACJA = FILES_DIR + "populacja.tsv";
const FILE_DEFICYT_BUDZETOWY = FILES_DIR + "deficyt_budzetowy.tsv";
const FILE_INFLACJA = FILES_DIR + "inflacja.tsv";
const FILE_PRZYCHODY_RZADU = FILES_DIR + "przychody_rzadu.tsv";
const FILE_WYDATKI_OPIEKA_SOCJALNA = FILES_DIR + "wydatki_opieka_socjalna.tsv";
const FILE_WYDATKI_RZADU = FILES_DIR + "wydatki_rzadu.tsv";
const FILE_WZROST_PKB = FILES_DIR + "wzrost_pkb.tsv";

var countryMap = {
	"AT":"Austria",
	"BG":"Bulgaria",	
	"BE":"Belgium",
	"HR":"Croatia",
	"CY":"Cyprus",
	"CZ":"Czech Republic",
	"DK":"Denmark",
	"EE":"Estonia",
	"FI":"Finland",
	"DE":"Germany",
	"IE":"Ireland",
	"FR":"France",
	"EL":"Greece",
	"ES":"Spain",
	"IT":"Italy",
	"LV":"Latvia",
	"LT":"Lithuania",
	"LU":"Luxembourg",
	"HU":"Hungary",
	"MT":"Malta",
	"NL":"Netherlands",
	"PL":"Poland",
	"PT":"Portugal",
	"RO":"Romania",
	"SI":"Slovenia",
	"SK":"Slovakia",
	"SE":"Sweden",
	"UK":"United Kingdom",
	
	"Austria":"AT",
	"Bulgaria":"BG",
	"Belgium":"BE",
	"Croatia":"HR",
	"Cyprus":"CY",
	"Czech Republic":"CZ",
	"Denmark":"DK",
	"Estonia":"EE",
	"Finland":"FI",
	"Germany":"DE",
	"Ireland":"IE",
	"France":"FR",
	"Greece":"EL",
	"Spain":"ES",
	"Italy":"IT",
	"Latvia":"LV",
	"Lithuania":"LT",
	"Luxembourg":"LU",
	"Hungary":"HU",
	"Malta":"MT",
	"Netherlands":"NL",
	"Poland":"PL",
	"Portugal":"PT",
	"Romania":"RO",
	"Slovenia":"SI",
	"Slovakia":"SK",
	"Sweden":"SE",
	"United Kingdom":"UK"
}

var data;

function getData(file, countries, years){
	readFile(file);
	var rawData = data;
	var yearColumnNumbers = parseYearsToColumnNumbers(rawData, years);
	//console.log(yearColumnNumbers);
	var countryTags = parseContriesToTag(countries);
	//console.log(countryTags);
	var resultData = [];
	
	for(var i=0; i<countryTags.length; i++){
		resultData[i]=getDataRow(rawData, countryTags[i], yearColumnNumbers);
	}
	return resultData;
}

function getDataRow(rawData, countryTag, yearColumnNumbers){
	var row = [];
	for(var i=1; i<rawData.length; i++){
		splited = rawData[i][0].split(',');
		if(splited[splited.length - 1] == countryTag){
			row[0] = countryMap[countryTag];
			for(var j=0; j<yearColumnNumbers.length; j++){
				row[j+1] = rawData[i][yearColumnNumbers[j]].split(" ")[0];
			}
			break;
		}
	}
	return row;
}

function parseContriesToTag(countries){
	var newCountries = [];
	for(var i=0; i<countries.length; i++){
		newCountries[i] = countryMap[countries[i]];
	}
	return newCountries;
}

function parseYearsToColumnNumbers(rawData, years){
	var newYears = [];
	for(var j=0;j < years.length; j++) {
		for(var i=0; i<rawData[0].length; i++){
			if(rawData[0][i].trim()==years[j]){
				newYears[j]=i;
			}
		}
	}
	return newYears;
}

function readFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                data = parseStringToTsv(rawFile.responseText);
            }
        }
    }
    rawFile.send(null);
}

function parseStringToTsv(str){
	var x = str.split('\n');
	for (var i=0; i<x.length; i++) {
		y = x[i].split('\t');
		x[i] = y;
	}
	return x;
}


