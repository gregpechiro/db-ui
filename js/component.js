
var components = [];
var component;
var resource = "http://192.168.0.80:4567/ui";
var count = 1;
var multi = false;
var addOptionDiv = 'div[id="all-options"] div[id="add-option"]';

function getUrlParameter(param) {
    var pageURL = window.location.search.substring(1);
    var urlVariables = pageURL.split('&');
    for (var i = 0; i < urlVariables.length; i++) {
        var parameterName = urlVariables[i].split('=');
        if (parameterName[0] == param) {
            return parameterName[1];
        }
    }
}

function getData(url, handleData) {
	$.ajax({
		url: url,
		dataType:'json',
		success:function(data) {
			handleData(data);
		},
		error: function() {
			console.log('error retrieving');
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
			console.log('saved');
		},
		error: function() {
			console.log('error saving');
		}
	});
}

function fill(index) {
	var c = components[index];
	$('input[id="name"]').val(c.name);
	$('select[id="type"]').val(c.type);
	$('input[id="resource"]').val(c.resource);
	for (var i = 0; i < c.data.length; i++) {
		$('div[id="option' + i + '"] input').val(c.data[i].name);
		$('div[id="option' + i + '"] select').val(c.data[i].type);
		if ((i + 1) < c.data.length) {
			addOption();
		}
	}
}

// add input with delete button add placeholder after input set delete action
function addOption() {
	$(addOptionDiv).html($('div[id="next-option-input"]').html());
	$(addOptionDiv).attr('id', 'option' + count);
	$('div[id="option' + count + '"] input').attr('id', 'option' + count);
	$('div[id="option' + count + '"] select').attr('id', 'option' + count);
	$('div[id="option' + count + '"] button').attr('id', 'option' + count);
	$('div[id="option' + count + '"]').after($('div[id="next-option-div"]').html());
	$('button[id="option' + count + '"]').click(function() {
		$('div[id="'+$(this).attr('id')+'"]').remove();
	});
	count++;
}

$(document).ready(function() {

	getData(resource, function(data) {
		components = data;
		component = getUrlParameter('component');
		if (component != null) {
			component =+ component;
			fill(component);
		}
	});

	$('button[id="add-option-button"]').click(function() {
		addOption();
	});

	$('button[id="save"]').click(function() {
		var stuff = {};
		stuff['name'] = $('input[id="name"]').val();
		stuff['type'] = $('select[id="type"]').val();
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
		if (component != null) {
			components[component] = stuff
		} else {
			components.push(stuff);
		}
        saveData(components);
	});
});
