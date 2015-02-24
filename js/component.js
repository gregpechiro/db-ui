var content = [];
var resource = "http://localhost:4567/ui";
	
function getData(handleData) {
	$.ajax({
		url: resource,
		dataType:'json',
		success:function(data) {
			handleData(data);
		},
		error: function() {
			alert('error retrieving');
		}
	});
}

function saveData(data) {
	console.log(data);
	$.ajax({
		url: resource,
		type: 'post',
		data: JSON.stringify(data),
		success: function() {
			alert('saved');
		},
		error: function() {
			alert('error saving');
		}
	});
}

getData(function(data) {
	content = data;
	return JSON.stringify(content);
});


var i = 1;
var multi = false;
var addOptionDiv = 'div[id="all-options"] div[id="add-option"]';
// add input with delete button add placeholder after input set delete action
function addOption() {
	$(addOptionDiv).html($('div[id="next-option-input"]').html());
	$(addOptionDiv).attr('id', 'option'+i);
	// $('div[id="option' + i + '"] input').attr('id', 'option'+i);
	$('div[id="option' + i + '"] button').attr('id', 'option'+i);
	$('div[id="option' + i + '"]').after($('div[id="next-option-div"]').html());
	$('button[id="option' + i + '"]').click(function() {
		$('div[id="'+$(this).attr('id')+'"]').remove();
	});
	i++;
}

$(document).ready(function() {
	$('button[id="add-option-button"]').click(function() {
		addOption();
	});

	$('button[id="save"]').click(function() {
		var stuff = {};
		stuff['name'] = $('input[id="name"]').val();
		stuff['type'] = $('input[id="type"]').val();
		stuff['resource'] = $('input[id="resource"]').val();
		var data = [];
		var spans = $('div[id="all-options"] span[name="option"]');
		for (var i = 0; i < spans.length; i++) {
			var dat = {};
			dat['name'] = spans[i].children[0].value;
			dat['type'] = spans[i].children[1].value;
			data.push(dat);
		}
		stuff['data'] = data;
		content.push(stuff);
		saveData(content);
	});
});