
var resource = "data/components.json";

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
	table += '<table><thead><tr><th>Name</th><th>Type</th><th>Resource</th><th>Data</th><th></th></tr></thead><tbody>';
	for(var row in data) {
		table += '<tr><td>' + data[row].name + '</td>';
		table += '<td>' + data[row].type + '</td>';
		table += '<td>' + data[row].resource + '</td>';
		table += '<td>';
		for (var i = 0; i < data[row].data.length; i++) {
			table += 'Name: ' + data[row].data[i].name + '<br>';
			table += 'Type: ' + data[row].data[i].type + '<br>';
		}
		table += '</td>'
		table += '<td><a href="/db-ui/component.html?component=' + row + '">Edit</a></td></tr>';
	}
	table += '</tbody></table>';
	return table;
}

$(document).ready(function() {

    getData(function(data) {
        init(data);
    });
});
