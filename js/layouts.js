
var resource = "http://localhost:8080/view/layout";

function getData(handleData) {
	$.ajax({
		url: resource,
		dataType:'json',
		success:function(data) {
			handleData(data);
		},
		error: function() {
			console.log('error retrieving');
		}
	});
}

function init(data) {
	getData(function(data) {
		var table = generateTable(data);
		$('div[id="table"]').html(table);
	});
}

function generateTable(data) {
	var table = '';
	table += '<table><thead><tr><th>Name</th><th>Global Resource</th><th>Template</th><th>Components</th><th></th></tr></thead><tbody>';
	for(var row in data) {
		table += '<tr><td>' + data[row].name + '</td>';
		table += '<td>' + data[row].globalResource + '</td>';
		table += '<td>' + data[row].template + '</td>';
		table += '<td>' + data[row].components + '</td>';
		table += '<td><a href="/db-ui/layout.html?layout=' + data[row].id + '">Edit</a></td></tr>';
	}
	table += '</tbody></table>';
	return table;
}

$(document).ready(function() {

	init();

});
