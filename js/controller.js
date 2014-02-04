var app = angular.module("app", ['ui.validate']);

app.run();

app.controller('Ctrl', function($scope, $filter, $q, $http) {
    $scope.tasks = [
        {name: 'task1', period: 2, WCET: 1, offset: 0, deadline: 2},
        {name: 'task2', period: 4, WCET: 1, offset: 0, deadline: 2},
        {name: 'task3', period: 2, WCET: 1, offset: 0, deadline: 2}
    ];

    // add
    $scope.addTask = function() {
        $scope.tasks.push({
            name: "New Task" + ($scope.tasks.length+1).toString(),
            period: null,
            WCET: null,
            offset: 0,
            deadline: 0
        });
    };

    // delete
    $scope.deleteTask = function(task) {
        console.log(task);

        var tasks = $scope.tasks;
        for(var i=0;i<tasks.length;i++){
            if(tasks[i] == task){
                tasks.splice(i, 1);
                break;
            }
        }
    };

    $scope.schedule = function() {
        render_schedule(schedule({tasks:$scope.tasks}));
    };

    $scope.isNumber = function(val) {
        var isNumber = $.isNumeric(val);
        return isNumber;
    };

    $scope.isEmpty = function(val) {
        var isEmpty = !val || val === '';
        return isEmpty;
    };

});

// Workaround for bug #1404
// https://github.com/angular/angular.js/issues/1404
// Source: http://plnkr.co/edit/hSMzWC?p=preview
app.config(['$provide', function($provide) {
    $provide.decorator('ngModelDirective', function($delegate) {
        var ngModel = $delegate[0], controller = ngModel.controller;
        ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
            var $interpolate = $injector.get('$interpolate');
            attrs.$set('name', $interpolate(attrs.name || '')(scope));
            $injector.invoke(controller, this, {
                '$scope': scope,
                '$element': element,
                '$attrs': attrs
            });
        }];
        return $delegate;
    });
    $provide.decorator('formDirective', function($delegate) {
        var form = $delegate[0], controller = form.controller;
        form.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
            var $interpolate = $injector.get('$interpolate');
            attrs.$set('name', $interpolate(attrs.name || attrs.ngForm || '')(scope));
            $injector.invoke(controller, this, {
                '$scope': scope,
                '$element': element,
                '$attrs': attrs
            });
        }];
        return $delegate;
    });
}]);

