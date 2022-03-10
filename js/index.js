let baseUrl = "http://localhost:8080/proxy";

let btn = document.getElementById("btn-refresh");
btn.addEventListener('click', event => {
	$("#topResource").empty();
	$("#topIp").empty();
	$("#dataResource").empty();

	getTopData( "/top/tarjet/2022-03-08T07%3A45%3A27/2022-03-15T07%3A45%3A27/10", "resource", $("#topResource") );
	getTopData( "/top/ip/2022-03-08T07%3A45%3A27/2022-03-15T07%3A45%3A27/10", "ip", $("#topIp") );
	getDataResource("/data/day/tarjet",  $("#dataResource"));
});


async function getDataResource( path, canvas ) {
	$.ajax({
		url: baseUrl + path ,
		type:"GET",
		contentType:"application/json; charset=utf-8",
		dataType: 'json', // type of response data
		timeout: 500,     // timeout milliseconds
		success: function (data,status,xhr) {   // success callback function

			createLineChart( data,canvas);
		},
		error: function (jqXhr, textStatus, errorMessage) { // error callback 
			console.log('Error: ' + errorMessage);
		}
	});
}


async function getTopData( path, topType, canvas ) {
	$.ajax({
		url: baseUrl + path ,
		type:"GET",
		contentType:"application/json; charset=utf-8",
		dataType: 'json', // type of response data
		timeout: 500,     // timeout milliseconds
		success: function (data,status,xhr) {   // success callback function

			createBarChart(getDataChart(data),getLabelsChart(data, topType ), canvas);
		},
		error: function (jqXhr, textStatus, errorMessage) { // error callback 
			console.log('Error: ' + errorMessage);
		}
	});
}

function getDataChart(dataJsn){
	var tops = [];
	dataJsn.forEach(function (row) {
		console.log("row: ",row)
		tops.push(row.total);
		
	});
	return tops;
}

function getLabelsChart(dataJsn, typeTop){
	var topsLabels = [];

	dataJsn.forEach(function (row) {
		console.log("row: ",row)
		if(typeTop === "ip"){
			topsLabels.push(row.ip);
		}else if(typeTop === "resource"){
			topsLabels.push(row.resource);
		}
		
	});
	return topsLabels;
}

function createBarChart( dataTop,  labels, canvas ) {
	const DATA_COUNT = 7;
	const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

	const data = {
	labels: labels,
	datasets: [
		{

		label: '',
		data: dataTop,
		borderColor: 'rgba(255, 99, 132, 1)',
		backgroundColor: 'rgba(255, 206, 86, 0.2)',
		borderWidth: 2,
		borderRadius: Number.MAX_VALUE,
		borderSkipped: false,
		}
	]
	};

	var ctx = canvas;
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: data,
		options: {
		responsive: true,
		plugins: {
			legend: {
			position: 'top',
			},
			title: {
			display: true,
			text: 'Chart.js Bar Chart'
			}
		}
		},
	});
}

function createLineChart( json, canvas ){
	var ctx2 = canvas;
	var dataSets = getDataSets(json );
	var labels   = getLabels(json);

	var myChart = new Chart(ctx2, {
		type: 'line',
		data: {
			labels: labels,
			datasets: dataSets
		}
	});
}


function getLabels( jsonData ){
	var labels = [];
	var lastRow;
	jsonData.forEach(function (rowSource) {

		lastRow = rowSource.total;
		
		
		
	});
	
	lastRow.forEach(function (row) {
		labels.push(row.hour);
	});
	
	return labels;
}

function getDataSets( jsonData){
	var dataSets = [];
	
	jsonData.forEach(function (rowSource) {
		var dataCounts = [];
		rowSource.total.forEach(function (rowTotal) {
			dataCounts.push(rowTotal.total);
			
		});
		var colorLine = generateRandomColor();
		var dataSet = { 
			data: dataCounts,
			label: rowSource.resource,
			borderColor: colorLine,
			fill: false
		};
		dataSets.push(dataSet);
		
	});

	return dataSets;
}


function generateRandomColor(){
	let maxVal = 0xFFFFFF; // 16777215
	let randomNumber = Math.random() * maxVal; 
	randomNumber = Math.floor(randomNumber);
	randomNumber = randomNumber.toString(16);
	let randColor = randomNumber.padStart(6, 0);   
	return `#${randColor.toUpperCase()}`
}




