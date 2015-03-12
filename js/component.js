
var resource = "http://localhost:8080/view/component";
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

function save() {
    var component = {};
    component['id'] = $('input[id="id"]').val();
    component['name'] = $('input[id="name"]').val();
    component['type'] = $('select[id="type"]').val();
    component['resource'] = $('input[id="resource"]').val();
    var data = [];
    if (component['type'] != 'iframe') {
        var spans = $('div[id="all-options"] span[name="option"]');
        for (var i = 0; i < spans.length; i++) {
            var dat = {};
            dat['name'] = spans[i].children[0].value;
            dat['type'] = spans[i].children[1].value;
            data.push(dat);
        }
    }
    component['data'] = data;
    $.ajax({
          type: "POST",
          url: 'http://localhost:8080/view/component',
          data: JSON.stringify(component),
        contentType: "application/json; charset=utf-8",
          success: function() {
            console.log('success');
        },
        error: function() {
            console.log('error');
        }
    });
}

function fill(c) {
    $('input[id="id"]').val(c.id);
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

function init() {
    var componentId = getUrlParameter('component');
    if (componentId != null) {
        getData(resource + '/' + componentId, function(data) {
            fill(data)
        });
    }
}

$(document).ready(function() {

	$('button[id="add-option-button"]').click(function() {
		addOption();
	});

	$('button[id="save"]').click(function() {
        save();
	});

    init();

});
