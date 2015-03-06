
var content = [];
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

$(document).ready(function() {

    var content = [];

    getData(function(data) {
        init(data);
    });

    function init(data) {
        content = data;
        var table = generateTable(data);
        $('div[id="table"]').html(table);
    }

    function generateTable(data) {
		var table = '';
		table += '<table><thead><tr><th>Name</th><th>type</th><th>Resource</th><th></th></tr></thead><tbody>';
		for(var row in data) {
			table += '<tr><td>' + data[row].name + '</td>';
            table += '<td>' + data[row].type + '</td>';
            table += '<td>' + data[row].resource + '</td>';
            table += '<td><a href="/db-ui/component.html?component=' + row + '">Edit</a></td></tr>';
		}
		table += '</tbody></table>';
		return table;
	}


});
