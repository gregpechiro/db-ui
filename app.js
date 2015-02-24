
var gridster = angular.module('gridster', [])

gridster.controller('gridCtrl', ['$scope', '$compile', function ($scope, $compile) {

	$scope.buttons = [];
	var stuff = [];

	$scope.addButton = function() {
		var button = {
			name: 'Default Name',
			click: function() {
				$scope.edit(index);
			}
		};
		$scope.buttons.push(button);
		var index = $scope.buttons.length - 1;
		$scope.rename = index;
		var gridster = $(".gridster ul").gridster().data('gridster');
		var tmpl = $compile('<li><button class="btn btn-default btn-block">{{ buttons[' + index + '].name }}</button></li>')( $scope );
		gridster.add_widget(tmpl, 4, 1);
	}

	$scope.edit = function(index) {
		$scope.rename = index;
	};

	$scope.serialize = function() {
		var gridster = $(".gridster ul").gridster().data('gridster');
		var ser = gridster.serialize();
		stuff = ser;
	};

	$scope.clear = function() {
		var gridster = $(".gridster ul").gridster().data('gridster');
		gridster.remove_all_widgets();
	};

	$scope.fill = function() {
		var gridster = $(".gridster ul").gridster().data('gridster');
		$.each(stuff, function() {
		    gridster.add_widget('<li>' + this.stuff + '</li>', this.size_x, this.size_y, this.col, this.row);
		});
	};

}])