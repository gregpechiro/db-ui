var obj = [
    [{
        name: "id",
        value: "27819-878-7843912",
        type: "text"
    }, {
        name: "firstName",
        value: "Scott",
        type: "text"
    }, {
        name: "lastName",
        value: "Cagno",
        type: "text"
    }, {
        name: "email",
        value: "scagno@example.com",
        type: "email"
    }, {
        name: "phone",
        value: "717-283-9278",
        type: "phone"
    }, {
        name: "age",
        value: 28,
        type: "number"
    }, {
        name: "active",
        value: true,
        type: "text"
    }],
    [{
        name: "id",
        value: "18329-783-8432890",
        type: "text"
    }, {
        name: "firstName",
        value: "Kayla",
        type: "text"
    }, {
        name: "lastName",
        value: "Cagno",
        type: "text"
    }, {
        name: "email",
        value: "kcagno@example.com",
        type: "email"
    }, {
        name: "phone",
        value: "717-468-8292",
        type: "phone"
    }, {
        name: "age",
        value: 25,
        type: "number"
    }, {
        name: "active",
        value: false,
        type: "text"
    }]
];

function titleCase(word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
}

function generateForm(data) {
    var form = ['<form id="form" method="post" action="#" class="forms">','<fieldset>','<legend>Form</legend>'];
    for (var j = 0; j < data.length; j++) {
        form.push('<label>' + titleCase(data[j].name));
        form.push('<input id="' + data[j].name + '" type="' + data[j].type + '" name="' + data[j].name + '" value="' + data[j].value + '" class="width-100"/>');
        form.push('</label>');
    }
    form.push('<input id="data" type="hidden" />');
    form.push('<p><button type="submit" class="btn btn-blue width-100">Submit</button></p>');
    form.push('</fieldset>');
    form.push('</form>');
    return form.join('');
}

function generateTable(data) {
    var cols = ['<thead><tr>'];
    for (var i = 0; i < data[0].length; i++) {
        cols.push('<th>' + titleCase(data[0][i].name) + '</th>');
    }
    cols.push('</tr></thead>');
    var rows = ['<tbody>'];
    for (var x = 0; x < data.length; x++) {
        rows.push('<tr>');
        for (var y = 0; y < data[x].length; y++) {
            rows.push('<td>' + data[x][y].value + '</td>');
        }
        rows.push('</tr>');
    }
    return ['<table id="table" class="table-bordered table-striped table-responsive">', cols.join(''), rows.join(''), '</table>'].join('');
}

function getTable(){document.getElementById('table').innerHTML = generateTable(obj)};
function getForm(){document.getElementById('form').innerHTML = generateForm(obj[1])};
