
var count = 1;
var componentsUrl = "data/components.json";
var templatesUrl = "data/templates.json";
var components = [];
var templates = [];
var tableHtml = '<table style="width:100%;"><thead><tr><th>Head 1</th><th>Head 2</th><th>Head 3</th><th>Head 4</th><th>Head 5</th><th>Head 6</th></tr></thead><tbody><tr><td>Data 1-1</td><td>Data 1-2</td><td>Data 1-3</td><td>Data 1-4</td><td>Data 1-5</td><td>Data 1-6</td></tr><tr><td>Data 2-1</td><td>Data 2-2</td><td>Data 2-3</td><td>Data 2-4</td><td>Data 2-5</td><td>Data 2-6</td></tr><tr><td>Data 3-1</td><td>Data 3-2</td><td>Data 3-3</td><td>Data 3-4</td><td>Data 3-5</td><td>Data 3-6</td></tr><tr><td>Data 4-1</td><td>Data 4-2</td><td>Data 4-3</td><td>Data 4-4</td><td>Data 4-5</td><td>Data 4-6</td></tr></tbody></table>'
var formHtml = '<form><input style="width:100%;" placeholder="Input 1"><input style="width:100%;" placeholder="Input 2"><input style="width:100%;" placeholder="Input 3"><input style="width:100%;" placeholder="Input 4"><button style="width:100%;">Save</button></form>'
var fields ='<div class="width-75">' +
				'<fieldset>' +
				'<legend>Add/Edit Fields</legend>' +
				'<div id="all-options">' +
					'<div id="option0">' +
						'<span name="option">' +
							'<input id="option0" type="text" name="name" class="width-50" placeholder="Name">' +
							'<select id="option0" class="width-25">' +
								'<option value="text">Text</option>' +
								'<option value="number">Number</option>' +
								'<option value="boolean">Boolean</option>' +
							'</select>' +
						'</span>' +
					'</div>' +
					'<div id="add-option"></div>' +
					'<button id="add-option-button" class="btn width-50">Add Option</button>' +
				'</div>' +
				'<button id="save" name="save" class="btn btn-green">Save</button>' +
				'<select id="type">' +
					'<option>Form</option>' +
					'<option>Table</option>' +
					'<option>Info</option>' +
				'</select>' +
				'</fieldset>' +
			'</div>';

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

function templateOption() {
    var options = '<option value="none">--- Choose a Template ---</option>'
    for (var i = 0; i < templates.length; i++) {
        options += '<option value="' + i + '">' + templates[i].name + '</option>';
    }
    $('select[id="templates"]').html(options);
}

function init() {
    getData(componentsUrl, function(data) {
        components = data;
    });

    getData(templatesUrl, function(data) {
        templates = data;
        templateOption();
    });
}

function linkComponentSelect() {
    $('select.choose').change(function() {
		var id = 'component' + this.parentNode.parentNode.id
        if (this.value == 'global') {
            $('div[id="' + id + '"]').html(fields);
			$('div[id="' + id + '"] button[id="add-option-button"]').click(function() {
				//alert(id);
				addOption(id);
			});
        } else if (this.value != 'none') {
            var index =+ this.value;
            $('div[id="' + id + '"]').html(filler(components[index].type));
        } else {
            $('div[id="' + id + '"]').html('');
        }
    });
}

function getComponentSelect() {
    var s = '<select class="choose"><option value="none">--- Choose a Component ---</option>'+
            '<option value="global">Global Resource</option>';
    for (var i = 0; i < components.length; i++) {
        s += '<option value=' + i + '>' + components[i].name + '</option>';
    }
    s += '</select>';
    return s;
}


function positions(index) {
    var template = templates[index];
    var positions = '<div class="units-row units-padding">';
    var currentWidth = 0;
    var innerSelect = getComponentSelect();
    for (var i = 0; i < template.positions.length; i++) {
        var position = '<div id="' + i + '" style="border:1px solid black" class="unit-' + template.positions[i] + '">'+
                '<h4>Position ' + (i+1) + ' : ' + innerSelect + '</h4>'+
                '<div id="component' + i + '"></div>'+
            '</div>';
        if ((currentWidth + template.positions[i]) > 100) {
            positions += '</div><div class="units-row units-padding">'
            currentWidth = template.positions[i];
        } else {
            currentWidth += template.positions[i];
        }
        positions += position;
    }
    position += '</div>';
    $('div[id="positions"]').html(positions);
    linkComponentSelect();
}

function filler(type) {
    switch (type) {
        case 'form':
            return formHtml;
            break;
        case 'table':
            return tableHtml;
            break;
    }
}

// add input with delete button add placeholder after input set delete action
function addOption(parentId) {
	var addOptionDiv = 'div[id="' + parentId + '"] div[id="all-options"] div[id="add-option"]';
	$(addOptionDiv).html($('div[id="next-option-input"]').html());
	$(addOptionDiv).attr('id', 'option' + count);
	$('div[id="option' + count + '"] input').attr('id', 'option' + count);
	$('div[id="option' + count + '"] select').attr('id', 'option' + count);
	$('div[id="option' + count + '"] button').attr('id', 'option' + count);
	$('div[id="option' + count + '"]').after($('div[id="next-option-div"]').html());
	$('button[id="option' + count + '"]').click(function() {
		$('div[id="' + $(this).attr('id') + '"]').remove();
	});
	count++;
}


$(document).ready(function() {
    init();

    $('select[id="templates"]').change(function() {
        if ($('select[id="templates"]').val() != 'none') {
            positions($('select[id="templates"]').val());
        } else {
            $('div[id="positions"]').html('');
        }
    });

    $('button[id="save"]').click(function() {
        var layout ={};
        layout['name'] = $('input[id="layoutName"]').val();
        layout['template'] = $('select[id="templates"]').val();
        layout['components'] = [];
        for (var i = 0; i < templates[layout['template']].positions.length; i++) {
            layout['components'].push($('div[id="' + i + '"] select').val());
        }
        alert(JSON.stringify(layout));
    });


});
