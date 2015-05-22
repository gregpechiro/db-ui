// dynamically add field input type selecto and delete button
function addOption(field) {
    field = (field === undefined) ? {type:'text'} : field;
    $('div[id="editForm"] div[id="all-options"]').append($('div[id="next-option-input"]').html());
    $('div[id="editForm"] ' + addOptionDiv).attr('id', 'option' + count);
    $('div[id="editForm"] div[id="option' + count + '"] input').attr('id', 'option' + count).val(field.name);
    $('div[id="editForm"] div[id="option' + count + '"] select').attr('id', 'option' + count).val(field.type);
    $('div[id="editForm"] div[id="option' + count + '"] button').attr('id', 'option' + count);
    $('div[id="editForm"] button[id="option' + count + '"]').click(function(e) {
        e.preventDefault();
        $('div[id="editForm"] div[id="'+$(this).attr('id')+'"]').remove();
    });
    count++;
}

// reset the component modal
function resetEditForm() {
    $('div[id="editForm"] div.extra').remove();
    $('div[id="editForm"] input[id="option0"]').val('');
    $('div[id="editForm"] select[id="option0"]').val('text');
    $('div[id="editForm"] input[id="resource"]').val('');
    $('div[id="editForm"] select[id="type"]').val('form');
    count = 1;
}

// creat component from edit modal
function getEditForm() {
    var component = {};
    component['type'] = $('div[id="editForm"] select[id="type"]').val();
    component['resource'] = $('div[id="editForm"] input[id="resource"]').val();
    var data = [];
    if (component['type'] != 'iframe') {
        var spans = $('div[id="editForm"] div[id="all-options"] span[name="option"]');
        for (var i = 0; i < spans.length; i++) {
            var dat = {};
            dat['name'] = spans[i].children[0].value;
            dat['type'] = spans[i].children[1].value;
            data.push(dat);
        }
    }
    component['fields'] = data;
    return component;
}

// fill edit modal with  currently selected component
function edit(id) {
    editing = id;
    component = components[id];
    resetEditForm();
    $('#editForm select[id="type"]').val(component.type);
    $('#editForm input[id="resource"]').val(component.resource);
    if (component.type === form || component.type === table) {
        $('#editForm input[id="option0"]').val(component.fields[0].name);
        $('#editForm select[id="option0"]').val(component.fields[0].type);
        for (var i = 1; i < component.fields.length; i++) {
            addOption(component.fields[i]);
        }
    }
    $('#editModal').dialog('option', 'title', 'Editing Span: ' + editing);
    var buttons = $('#editModal').dialog('option', 'buttons');
    buttons[1].text = "Delete";
    if (buttons.length === 2) {
        buttons.push(
            {
                text: "Copy",
                click: function() {
                    var component = getEditForm();
                    add(component);
                    deleteComponent();
                }
            }
        );
    }
    $('#editModal').dialog('option', 'buttons', buttons);
    $('#editModal').dialog('open');
}

// initialize edit menu
function menuInit() {
    $('#editModal').dialog({
        title : 'Add',
        position: { my: "right	 top", at: "right top", of: window },
        width: 375,
        maxHeight: 550,
        buttons: [
            {
                text: "Save",
                click: function() {
                    var component = getEditForm();
                    if (editing != null) {
                        component.height = components[editing].height
                        component.width = components[editing].width
                        component.left = components[editing].left
                        component.top = components[editing].top
                    }
                    add(component);
                    deleteComponent(editing);
                }
            },
            {
                text: "Cancel",
                click: function() {
                    deleteComponent(editing);
                }
            }
        ]
    });
}
