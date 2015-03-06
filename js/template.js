var row = 0;
var position = 0;
var currentWidth = 0;


function getRowWidth(id) {
    var width = 0;
    var positions = $('div[id="row' + id + '"] div.position');
    for (var i = 0; i < positions.length; i++) {
        var w =+ positions[i].getAttribute('data-width');
        width += w;
    }
    return width;
}

function addRow() {
    row++;
    $('div[id="positions"]').html($('div[id="positions"]').html() + '<div id="row' + row + '" class="units-row units-padding"></div>');
    $('select[id="chosenRow"]').append('<option id="' + row + '" value="' + row + '">Row ' + row + '</option>');
}

function delRow(id) {
    $('div[id="row' + id + '"]').remove();
    $('select[id="chosenRow"] option[id="' + id + '"]').remove();
}

function addPosition() {
    position++;
    var width =+ $('input[id="width"]').val();
    if (currentWidth + width > 100) {
        addRow();
        currentWidth = width;
    } else {
        currentWidth += width;
    }
    $('div[id="row' + row + '"]').append('<div id="position' + position + '" style="border:1px solid black" data-width="' + width + '" class="position unit-' + width + '">');
    $('div[id="position' + position + '"]').html('<h3>Position ' + position + '</h3>');
}

function delPosition() {
    var width =+ $('div[id="position' + position + '"]').attr('data-width');
    $('div[id="position' + position + '"]').remove();
    if (currentWidth - width < 1 && row > 1) {
        delRow(row);
        row--;
        currentWidth = getRowWidth(row);
        position--;
    } else if (position > 0) {
        currentWidth -= width;
        position--;
    }
}

function addRowPosition(id) {
    var width = getRowWidth(id);
    position++;
    var rowWidth =+ $('input[id="rowWidth"]').val();
    if (width + rowWidth <= 100) {
        $('div[id="row' + id + '"]').append('<div id="position' + position + '" style="border:1px solid black" data-width="' + width + '" class="position unit-' + width + '">');
        $('div[id="position' + position + '"]').html('<h3>Position ' + position + '</h3>');
    } else {
        alert('New position too wide for row');
    }
}

$(document).ready(function() {
    $('button[id="addPosition"]').click(function() {
        addPosition();
    });

    $('button[id="delPosition"]').click(function() {
        delPosition();
    });

    $('button[id="addRowPosition"]').click(function() {
        var id = $('select[id="chosenRow"]').val();
        if (id != 'none') {
            addRowPosition(id);
        }
    });

    addRow();

});
