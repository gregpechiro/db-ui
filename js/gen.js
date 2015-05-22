// generate table html from component
function generateTable(component, live) {
    var panel = $('<div class="table"></div>');
    panel.append($('<div class="title">' + makeTitle(component.resource) + 's Table</div>'));
    var table = $('<table></table>');
    var headerRow = $('<tr></tr>');
    for (field in component.fields) {
        headerRow.append('<th>' + makeTitle(component.fields[field].name) + '</th>');
    }
    table.append($('<thead></thead>').append(headerRow));
    var tbody = $('<tbody></tbody>');
    if (live) {
        var row = $('<tr></tr>');
        for (field in component.fields) {
            row.append('<td>{{' + component.resource + '.' + component.fields[field].name + '}}</td>');
        }
        tbody.append('{% for ' + component.resource + ' in ' + component.resource + 's %}');
        tbody.append(row);
        tbody.append('{% endfor %}');
    } else {
        for (var j = 0; j < 5; j++) {
            var row = $('<tr></tr>');
            for (field in component.fields) {
                row.append('<td>DATA ' + j + '</td>');
            }
            tbody.append(row);
        }
    }
    table.append(tbody);
    panel.append(table);
    return panel;
}

// generate form html from component
function generateForm(component, live) {
    var panel = $('<div class="form"></div>');
    var title = $('<div class="title"></div>');
    title.append(makeTitle(component.resource) + ' Form');
    var body = $('<div class="body"></div>');
    var form = $('<form></form>');
    for(var field in component.fields) {
        if (component.fields[field].type !== 'boolean') {
            form.append('<label>' + makeTitle(component.fields[field].name) + '</label>');
            var input = $('<input>');
            input.attr('placeholder', makeTitle(component.fields[field].name));
            input.attr('name', component.fields[field].name);
            input.attr('type', component.fields[field].type);
            if (live) {
                input.attr('value', '{{' + component.resource + '.' + component.fields[field].name + '}}');
            }
            form.append(input);
        } else {
            var group = $('<div class="group"></div>');
            group.append('<label>' + makeTitle(component.fields[field].name) + '</label>');
            var input1 = $('<input type="radio">');
            input1.attr('name', component.fields[field].name);
            var input0 = $('<input type="radio">');
            input0.attr('name', component.fields[field].name);
            group.append(input1);
            group.append('True')
            group.append(input0);
            group.append('False');
            form.append(group);
        }
    }
    form.append('<button>Save</button>');
    body.append(form);
    panel.append(title);
    panel.append(body);

    return panel;
}


function generateIframe(component) {
    var iFrame = $('<iframe><iframe>');
    iFrame.attr('src', component.resource);
    iFrame.attr('width', component.width);
    iFrame.attr('height', component.height);
    return iFrame;
}

// display components from list of components
function display(data) {
    var spans = pageGen(data, false).children();
    spans.addClass('editable');
    $('#content').append(spans);
    init();
}

// create inner html from list of components
function pageGen(data, live) {
    var div = $('<div></div>');
    for(var id in data) {
        var component = data[id]
        var type = data[id].type;
        var span = $('<span style="position:absolute;"></span>');
        span.attr('id', id);
        span.css({top: component.top,left:component.left,height:component.height,width:component.width});
        switch(type) {
            case "table":
                span.html(generateTable(component, live));
                break;
            case "form":
                span.html(generateForm(component, live));
                break;
            default:
                alert("type: " + type + ", action: " + action);
        }
        div.append(span);
    }
    return div;
}


// get complete html document from list of components
function getPage() {
    console.log('<!doctype html><html><head></head><body>' + pageGen(components, true).prop('outerHTML') + '</body></html>');
}

// add component object to current document as html
function add(component) {
    var span = $('<span class="editable" style="position:absolute; width:300px"></span>');
    components[i] = component;
    span.attr('id', i);
    span.css({top: component.top, left: component.left, height: component.height, width: component.width});
    switch(component.type) {
        case "table":
            span.html(generateTable(component));
            break;
        case "form":
            span.html(generateForm(component));
            break;
        case 'iframe':
            span.html(generateIframe(component));
            break;
        default:
            alert("type: " + component.type + ", resource: " + component.resource);
    }
    $('#content').append(span);
    i++;
    init();
}
