
var layouts = [];
//var components = [];
//var templates = [];
var componentsUrl = "http://localhost:8080/view/component";
var templatesUrl = "http://localhost:8080/view/template";
var layoutsUrl = "http://localhost:8080/view/layout";
var globalData;

function getData(url, handleData, count) {
	$.ajax({
		url: url,
		dataType:'json',
		success:function(data) {
			handleData(data, count);
		},
		error: function(data) {
			console.log('error');
		}
	});
}

function init() {
    getData(layoutsUrl, function(data) {
        layouts = data;
        var options = '<option value="none">--- Choose a Layout ---</option>'
        for (var i = 0; i < layouts.length; i++) {
            options += '<option value="' + i + '">' + layouts[i].name + '</option>';
        }
        $('select[id="layouts"]').html(options);
    });
}

function renderLayout(index) {
    var layout = layouts[index];
	getData(templatesUrl + '/' + layout.template, function(template) {
    	var positions = template.positions;
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
    	if (layout.globalResource != "" && layout.globalResource != null) {
        	getData(layout.globalResource, function(data) {
            	globalData = data;
            	fill(layout.components);
        	});
    	} else {
        	fill(layout.components);
    	}
	});
}

function fill(layoutComponents) {
    for (var j = 0; j < layoutComponents.length; j++) {
		count = j;
		getData(componentsUrl + '/' + layoutComponents[j], function(component, j) {
        	switch (component.type) {
            	case 'table':
                	getTable(component, j);
                	break;
            	case 'form':
                	getForm(component, j);
                	break;
            	case 'info':
                	getInfo(component, j);
					break;
				case 'iframe':
					getIframe(component, j);
					break;
        	}
		}, j);
    }
}

function getTable(component, id) {
    if (component.resource == 'global') {
		$('div[id="render' + id + '"]').html(generateTable(globalData, component));
	} else if (component.resource != '' && component.resource != null) {
        $.ajax({
            url: component.resource,
            success: function(data) {
                $('div[id="render' + id + '"]').html(generateTable(data, component));
            },
            error: function(data) {
                console.log('error');
            }
        });
    }
}

function getForm(component, id) {
    $('div[id="render' + id + '"]').html(generateForm(component, id));
	setup(id);
}

function getInfo(component, id) {
	if (component.resource == 'global') {
		$('div[id="render' + id + '"]').html(generateInfo(globalData, component));
	} else if (component.resource != '' && component.resource != null) {
        $.ajax({
            url: component.resource,
            success: function(data) {
                $('div[id="render' + id + '"]').html(generateInfo(data, component));
            },
            error: function(data) {
                console.log('error');
            }
        });
    }
}

function getIframe(component, id) {
    $('div[id="render' + id + '"]').html(generateIframe(component));
}

function generateTable(data, component) {
    var table = component.name + '<table class="width-100 table-bordered"><thead><tr>';
    var fields = component.data;
    for (var i = 0; i < fields.length; i++) {
        table += '<th>' + title(fields[i].name) + '</th>';
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

function generateForm(component, id) {
    var form = component.name + '<form id="form' + id + '" method="post" action="' + component.resource + '">';
    var fields = component.data;
    for (var i = 0; i < fields.length; i++) {
        switch (fields[i].type) {
            case 'text':
                form +=
                        '<label><input class="width-100" type="text" name="'+
                        fields[i].name+
                        '" placeholder="' + title(fields[i].name) + '"></label>';
                break;
            case 'number':
                form +=
                        '<label><input class="width-100" type="number" name="'+
                        fields[i].name+
                        '" placeholder="' + title(fields[i].name) + '"></label>';
                break;
            case 'boolean':
                form += '<label>'+ title(fields[i].name) +
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
    form += '</form><button id="' + id + '" class="btn btn-green width-100 save" type="submit">'+
            'Save</button>';
    return form;
}

function generateInfo(data, component) {
    var fields = component.data;
    var info = component.name + '<table class="width-100 table-simple">';
    for (var i = 0; i < fields.length; i++) {
        info += '<tr><td style="text-align: right;"><b>' + title(fields[i].name) +
        ': </b></td><td style="text-align: left;">' + data[fields[i].name] + '</td></tr>'
    }
    info += '</table>';
    return info;
}

function generateIframe(component) {
	return component.name + '<iframe width="100%" src="' + component.resource + '"></iframe>';
}

function formToObject(form) {
	var object = {};
	var formArray = form.serializeArray();
	$.each(formArray, function() {
		if (object[this.name] !== undefined) {
			if (!object[this.name].push) {
				object[this.name] = [object[this.name]];
			}
	    		object[this.name].push(this.value || '');
		} else {
			object[this.name] = this.value || '';
		}
	});
	return object;
};

function setup(id) {
	$('button[id="' + id + '"]').click(function() {
		var data = formToObject($('form[id="form' + this.id + '"]'));
		$.ajax({
			type: "POST",
			url: $('form[id="form' + this.id + '"]').attr('action'),
			data: JSON.stringify(data),
			//contentType: "application/json; charset=utf-8",
			success: function(data, status, xhr) {
				console.log('successfully posted form');
				console.log(xhr.status);
			},
			error: function(xhr) {
				console.log('error posting form');
				console.log(xhr.status);
			}
		});
	});
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
