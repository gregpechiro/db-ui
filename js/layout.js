var templates = [
    {
        name: 'Template 1',
        positions: [100]
    }, {
        name: 'Template 2',
        positions: [100, 100]
    }, {
        name: 'Template 3',
        positions: [50, 50]
    }, {
        name: 'Template 4',
        positions: [100, 50, 50]
    }, {
        name: 'Template 5',
        positions: [100, 50, 50, 100]
    }
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
    var options = '<option value="none">--- Choose a Template ---</option>'
    for (var i = 0; i < templates.length; i++) {
        options += '<option value="' + i + '">' + templates[i].name + '</option>';
    }

    $('select[id="templates"]').html(options);

    getData(function(data) {
        content = data;
    });
}

function linkComponentSelect() {
    $('select.choose').change(function() {
        if (this.value != 'none') {
            var index =+ this.value;
            $('div[id="component' + this.parentNode.parentNode.id + '"]').html(filler(content[index].type));
        } else {
            $('div[id="component' + this.parentNode.parentNode.id + '"]').html('');
        }
    });
}

function getComponentSelect() {
    var s = '<select class="choose"><option value="none">--- Choose a Component ---</option>';
    for (var i = 0; i < content.length; i++) {
        s += '<option value=' + i + '>' + content[i].name + '</option>';
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
