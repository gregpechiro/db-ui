
function title(string) {
    return string[0].toUpperCase() + string.substring(1);
}

$(document).ready(function() {
    $('select.navSelect').change(function() {
        if (this.value != 'none') {
            window.location = this.value
        }
    });
});
