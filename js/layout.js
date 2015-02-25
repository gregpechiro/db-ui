var templates = [
    [{
        name: 'name',
        value: 'Template 1',
        type: 'text'
    }, {
        name: 'positions',
        value: [{
            width: 100
        }],
        type: 'list'
    }],
    [{
        name: 'name',
        value: 'Template 2',
        type: 'text'
    }, {
        name: 'positions',
        value: [{
            width: 100
        }, {
            width: 100
        }],
        type: 'list'
    }],
    [{
        name: 'name',
        value: 'Template 3',
        type: 'text'
    }, {
        name: 'positions',
        value: [{
            width: 50
        }, {
            width: 50
        }],
        type: 'number'
    }],
    [{
        name: 'name',
        value: 'Template 4',
        type: 'text'
    }, {
        name: 'positions',
        value: [{
            width: 100
        }, {
            width: 50
        }, {
            width: 50
        }],
        type: 'number'
    }],
    [{
        name: 'name',
        value: 'Template 5',
        type: 'text'
    }, {
        name: 'positions',
        value: [{
            width: 100
        }, {
            width: 50
        }, {
            width: 50
        }, {
            width: 100
        }],
        type: 'number'
    }],
];

var content = [];
var resource = "http://192.168.0.80:4567/ui";
var tableHtml = '<table style="width:100%;"><thead><tr><th>Head 1</th><th>Head 2</th><th>Head 3</th><th>Head 4</th><th>Head 5</th><th>Head 6</th></tr></thead><tbody><tr><td>Data 1-1</td><td>Data 1-2</td><td>Data 1-3</td><td>Data 1-4</td><td>Data 1-5</td><td>Data 1-6</td></tr><tr><td>Data 2-1</td><td>Data 2-2</td><td>Data 2-3</td><td>Data 2-4</td><td>Data 2-5</td><td>Data 2-6</td></tr><tr><td>Data 3-1</td><td>Data 3-2</td><td>Data 3-3</td><td>Data 3-4</td><td>Data 3-5</td><td>Data 3-6</td></tr><tr><td>Data 4-1</td><td>Data 4-2</td><td>Data 4-3</td><td>Data 4-4</td><td>Data 4-5</td><td>Data 4-6</td></tr></tbody></table>'
var formHtml = '<form><input style="width:100%;" placeholder="Input 1"><input style="width:100%;" placeholder="Input 2"><input style="width:100%;" placeholder="Input 3"><input style="width:100%;" placeholder="Input 4"><button style="width:100%;">Save</button></form>'
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

function init() {
    var options = '<option></option>'
    for (var i = 0; i < templates.length; i++) {
        options += '<option value="' + i + '">' + templates[i][0].value + '</option>';
    }

    $('select[id="templates"]').html(options);

    getData(function(data) {
        content = data;
    });
}

function linkComponentSelect() {
    $('select.choose').change(function() {
        var index =+ this.value;
        $('div[id="component' + this.parentNode.parentNode.id + '"]').html(filler(content[index].type));
    });
}

function getComponentSelect() {
    var s = '<label>Choose a Component</label><select class="choose"><option></option>';
    for (var i = 0; i < content.length; i++) {
        s += '<option value=' + i + '>' + content[i].name + '</option>';
    }
    s += '</select>';
    return s;
}


function positions(index) {
    var template = templates[index];
    var positions = '<div class="units-row units-padding">';
    var w = 0;
    var innerSelect = getComponentSelect();
    for (var i = 0; i < template[1].value.length; i++) {
        var position = '<div id="' + i + '" style="border:1px solid black" class="unit-' + template[1].value[i].width + '">'+
                '<h4>Position ' + (i+1) + ' : ' + innerSelect + '</h4>'+
                '<div id="component' + i + '"></div>'+
            '</div>';
        if ((w + template[1].value[i].width) > 100) {
            positions += '</div><div class="units-row units-padding">'
            w = template[1].value[i].width;
        } else {
            w +=template[1].value[i].width;
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


$(document).ready(function() {
    init();
    $('select[id="templates"]').change(function() {
        positions($('select[id="templates"]').val());
    });


});
