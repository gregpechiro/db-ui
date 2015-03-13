// global variables
var resource = "http://localhost:8080/view/template";

// initialize
function init() {
	getData(resource, function(data) {
		var table = generateTable(data);
		$('div[id="table"]').html(table);
    });
}

// generate table off of database data
function generateTable(data) {
	var table = '';
	table += '<table><thead><tr><th>Name</th><th>Positions</th><th></th></tr></thead><tbody>';
	for(var row in data) {
		table += '<tr><td>' + data[row].name + '</td>';
		table += '<td>' + data[row].positions + '</td>';
		table += '<td><a href="/db-ui/template.html?template=' + data[row].id + '">Edit</a></td></tr>';
	}
	table += '</tbody></table>';
	return table;
}

$(document).ready(function() {

	init();

});
