
function title(string) {
    return string[0].toUpperCase() + string.substring(1);
}

// ajax call to retreive data and handle the response in a passed in function
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

// read parameters from url
function getUrlParameter(param) {
    var pageURL = window.location.search.substring(1);
    var urlVariables = pageURL.split('&');
    for (var i = 0; i < urlVariables.length; i++) {
        var parameterName = urlVariables[i].split('=');
        if (parameterName[0] == param) {
            return parameterName[1];
        }
    }
}

$(document).ready(function() {
    $('select.navSelect').change(function() {
        if (this.value != 'none') {
            window.location = this.value
        }
    });
});
