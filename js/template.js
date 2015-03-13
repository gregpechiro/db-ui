// setup global variables
var row = 0;
var position = 0;
var currentWidth = 0;
var resource = 'http://localhost:8080/view/template';

// determine the current width of a row by the id
function getRowWidth(id) {
    var width = 0;
    var positions = $('div[id="row' + id + '"] div.position');
    for (var i = 0; i < positions.length; i++) {
        var w =+ positions[i].getAttribute('data-width');
        width += w;
    }
    return width;
}

// safely add a row (helper)
function addRow() {
    row++;
    $('div[id="positions"]').append('<div id="row' + row + '" class="units-row units-padding myRow"></div>');
    $('select[id="chosenRow"]').append('<option id="' + row + '" value="' + row + '">Row ' + row + '</option>');
}

// safely delete a row (helper)
function delRow(id) {
    $('div[id="row' + id + '"]').remove();
    $('select[id="chosenRow"] option[id="' + id + '"]').remove();
}

// add a single position to the last row
function addPosition(width) {
    position++;
    if (currentWidth + width > 100) {
        addRow();
        currentWidth = width;
    } else {
        currentWidth += width;
    }
    $('div[id="row' + row + '"]').append('<div id="position' + position + '" style="border:1px solid black" data-width="' + width + '" class="position unit-' + width + '">');
    $('div[id="position' + position + '"]').html('<h3>Position ' + position + '</h3>');
}

// delete a single position from the last row
function delPosition() {
    var width =+ $('div[id="position' + position + '"]').attr('data-width');
    $('div[id="position' + position + '"]').remove();
    if ((currentWidth - width) < 1 && row > 1) {
        delRow(row);
        row--;
        currentWidth = getRowWidth(row);
        position--;
    } else if (position > 0) {
        currentWidth -= width;
        position--;
    }
}

// add a single position to a given row
function addRowPosition(id) {
    var rowWidth = getRowWidth(id);
    position++;
    var width =+ $('input[id="rowWidth"]').val();
    if (width + rowWidth <= 100) {
        $('div[id="row' + id + '"]').append('<div id="position' + position + '" style="border:1px solid black" data-width="' + width + '" class="position unit-' + width + '">');
        $('div[id="position' + position + '"]').html('<h3>Position ' + position + '</h3>');
        reorganize();
    } else {
        alert('New position too wide for row');
    }
}

// delete a single position from a given row
function delRowPosition(id) {
    var positions = $('div[id="row' + id + '"] div.position');
    positions[positions.length - 1].remove();
    if (getRowWidth(id) < 1) {
        delRow(id);
    }
    reorganize();
}

// rename/reorder positions after addition/deletion to/from a given row
function reorganize() {
    position = 0;
    row = 0;
    currentWidth = 0;
    $('select[id="chosenRow"]').html('<option value="none">Choose a row</option>');
    var positions = $('div.position')
    $('div[id="positions"]').html('');
    addRow();
    for (var i = 0; i < positions.length; i++) {
        var width =+ positions[i].getAttribute('data-width');
        addPosition(width);
    }
}

// create template object and save to db
function save() {
    var template = {};
    template["name"] = $('input[id="templateName"]').val();
    template["id"] = $('input[id="templateId"]').val();
    var positions = [];
    for (var i = 0; i < position; i++) {
        var w =+ $('div[id="position' + (i+1) + '"]').attr('data-width');
        positions.push(w);
    }
    template['positions'] = positions;
    $.ajax({
          type: "POST",
          url: 'http://localhost:8080/view/template',
          data: JSON.stringify(template),
        contentType: "application/json; charset=utf-8",
          success: function() {
            console.log('success');
        },
        error: function() {
            console.log('error');
        }
    });
}

// fill with given template
function fill(template) {
    $('input[id="templateId"]').val(template.id);
    $('input[id="templateName"]').val(template.name);
    for (var i = 0; i < template.positions.length; i++) {
        addPosition(template.positions[i]);
    }
}

// intitialization
function init() {
    var tempId = getUrlParameter('template');
    if (tempId != null) {
        getData(resource + '/' + tempId, function(data) {
            fill(data);
        });
    }
}

$(document).ready(function() {
    $('button[id="addPosition"]').click(function() {
        var width =+ $('input[id="width"]').val();
        addPosition(width);
    });

    // $('button[id="delPosition"]').click(function() {
    //     delPosition();
    // });

    $('button[id="save"]').click(function() {
        save();
    });

    $('button[id="addRowPosition"]').click(function() {
        var id = $('select[id="chosenRow"]').val();
        if (id != 'none') {
            addRowPosition(id);
        }
    });

    $('button[id="delRowPosition"]').click(function() {
        var id = $('select[id="chosenRow"]').val();
        if (id != 'none') {
            delRowPosition(id);
        }
    });

    addRow();

    init();

});
