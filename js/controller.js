var app = angular.module("app", []);

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
            name: "New Task" + $scope.tasks.length+1,
            period: 0,
            WCET: 0,
            offset: 0,
            deadline: 0
        });
    };

    // delete
    $scope.deleteTask = function(task) {
        console.log(task);
    };

    $scope.schedule = function() {
        render_schedule(schedule({tasks:$scope.tasks}));
    };

});

