angular.module('angularCompile', [], function($compileProvider) {
    // configure new 'angularCompile' directive by passing a directive
    // factory function. The factory function injects the '$compile'
    $compileProvider.directive('angularCompile', function($compile) {
        // directive factory creates a link function
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    // watch the 'angular-compile' expression for changes
                    return scope.$eval(attrs.angularCompile);
                },
                function(value) {
                    // when the 'angular-compile' expression changes
                    // assign it into the current DOM
                    element.html(value);
    
                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(snippet);
                }
            );
        };
    })
});