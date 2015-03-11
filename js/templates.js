
var resource = "data/templates.json";

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
	content = data;
	var table = generateTable(data);
	$('div[id="table"]').html(table);
}

function generateTable(data) {
	var table = '';
	table += '<table><thead><tr><th>Name</th><th>Positions</th><th></th></tr></thead><tbody>';
	for(var row in data) {
		table += '<tr><td>' + data[row].name + '</td>';
		table += '<td>' + data[row].positions + '</td>';
		table += '<td><a href="/db-ui/template.html?template=' + row + '">Edit</a></td></tr>';
	}
	table += '</tbody></table>';
	return table;
}

$(document).ready(function() {

    getData(function(data) {
        init(data);
    });
});
