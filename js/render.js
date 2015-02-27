// var templates = [
//     {
//         name: 'Template 1',
//         positions: [100]
//     }, {
//         name: 'Template 2',
//         positions: [100, 100]
//     }, {
//         name: 'Template 3',
//         positions: [50, 50]
//     }, {
//         name: 'Template 4',
//         positions: [100, 50, 50]
//     }, {
//         name: 'Template 5',
//         positions: [100, 50, 50, 100]
//     }
// ];

var layouts = [
    {
        name:'Layout 1',
        template: 1,
        components:[0, 2]
    }, {
        name:'Layout 2',
        template: 2,
        components:[0, 4]
    }, {
        name:'Layout 3',
        template: 3,
        components:[3, 2, 4]
    }, {
        name:'Layout 4',
        template: 4,
        components:[0, 2, 1, 4]
    }
];



var components = [];
var templates = [];
var componentsUrl = "components.json";
var templatesUrl = "templates.json";

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

function init() {
    var options = '<option value="none">--- Choose a Layout ---</option>'
    for (var i = 0; i < layouts.length; i++) {
        options += '<option value="' + i + '">' + layouts[i].name + '</option>';
    }
    $('select[id="layouts"]').html(options);
    getData(componentsUrl, function(data) {
        components = data;
    });
    getData(templatesUrl, function(data) {
        templates = data;
    });
}

function renderLayout(index) {
    var layout = layouts[index];
    var positions = templates[layout['template']].positions;
    var render = '<div class="units-row units-padding">';
    var currentWidth = 0;
    for (var i = 0; i < positions.length; i++) {
        if ((currentWidth + positions[i]) > 100) {
            render += '</div><div class="units-row units-padding">';
            currentWidth = positions[i];
        } else {
            currentWidth += positions[i];
        }
        render += '<div id="render' + i + '" style="border:1px solid black" class="unit-' + positions[i] + '"></div>'
    }
    $('div[id="render"]').html(render);
    fill(layout.components)
}

function fill(layoutComponents) {
    for (var i = 0; i < layoutComponents.length; i++) {
        var component = components[layoutComponents[i]];
        switch (component.type) {
            case 'table':
                getTable(component, i);
                break;
            case 'form':
                getForm(component, i);
                break;
            case 'info':
                getInfo(component, i);
        }
    }
}

function getTable(component, id) {
    if (component.resource != '' || component.resource != null) {
        $.ajax({
            url: component.resource,
            success: function(data) {
                $('div[id="render' + id + '"]').html(generateTable(data, component));
            },
            error: function(data) {
                console.log(data);
            }
        });
    }
}

function getForm(component, id) {
    $('div[id="render' + id + '"]').html(generateForm(component));
}

function getInfo(component, id) {
    if (component.resource != '' || component.resource != null) {
        $.ajax({
            url: component.resource,
            success: function(data) {
                $('div[id="render' + id + '"]').html(generateInfo(data, component));
            },
            error: function(data) {
                console.log('error');
                console.log(data);
            }
        });
    }
}

function generateTable(data, component) {
    var table = component.name + '<table class="width-100 table-bordered"><thead><tr>';
    var fields = component.data;
    for (var i = 0; i < fields.length; i++) {
        table += '<th>' + capFirst(fields[i].name) + '</th>';
    }
    table += '</tr></thead><tbody>';
    for (var i = 0; i < data.length; i++) {
        table += '<tr>';
        for (var j = 0; j < fields.length; j++) {
            table += '<td>' + data[i][fields[j].name] + '</td>';
        }
        table += '</tr>';
    }
    table += '</tbody></table>';
    return table;
}

function generateForm(component) {
    var form = component.name + '<form method="post" action="' + component.resource + '">';
    var fields = component.data;
    for (var i = 0; i < fields.length; i++) {
        switch (fields[i].type) {
            case 'text':
                form +=
                        '<label><input class="width-100" type="text" name="'+
                        fields[i].name+
                        '" placeholder="' + capFirst(fields[i].name) + '"></label>';
                break;
            case 'number':
                form +=
                        '<label><input class="width-100" type="number" name="'+
                        fields[i].name+
                        '" placeholder="' + capFirst(fields[i].name) + '"></label>';
                break;
            case 'boolean':
                form += '<label>'+ capFirst(fields[i].name) +
                        '<input id="yes" type="radio" name="' +
                        fields[i].name +
                        '" value="yes"><label for="yes">Yes</label>' +
                        '<input id="no" type="radio" name="' +
                        fields[i].name +
                        '" value="no"><label for="no">No</label>' +
                        '</label>';
                break;
        }
    }
    form += '<button class="btn btn-green width-100" type="submit">'+
            'Save</button></form>';
    return form;
}

function generateInfo(data, component) {
    var fields = component.data;
    var info = component.name + '<table class="width-100 table-simple">';
    for (var i = 0; i < fields.length; i++) {
        info += '<tr><td style="text-align: right;"><b>' + capFirst(fields[i].name) +
        ': </b></td><td style="text-align: left;">' + data[fields[i].name] + '</td></tr>'
    }
    info += '</table>';
    return info;
}

function capFirst(string) {
    return string[0].toUpperCase() + string.substring(1);
}

$(document).ready(function() {
    init();
    $('select[id="layouts"]').change(function() {
        if ($('select[id="layouts"]').val() != 'none') {
            renderLayout($('select[id="layouts"]').val());
        } else {
            $('div[id="render"]').html('');
        }
    });
});
