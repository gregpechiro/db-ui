// global resources
var resource = "http://localhost:8080/view/component";
var count = 1;
var multi = false;
var addOptionDiv = 'div[id="all-options"] div[id="add-option"]';

// create component object and save to db
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

// fill with given component
function fill(component) {
    $('input[id="id"]').val(component.id);
	$('input[id="name"]').val(component.name);
	$('select[id="type"]').val(component.type);
	$('input[id="resource"]').val(component.resource);
	for (var i = 0; i < component.data.length; i++) {
		$('div[id="option' + i + '"] input').val(component.data[i].name);
		$('div[id="option' + i + '"] select').val(component.data[i].type);
		if ((i + 1) < component.data.length) {
			addOption();
		}
	}
}

// initialize
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
