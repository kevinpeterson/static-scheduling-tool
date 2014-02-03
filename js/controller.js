var app = angular.module("app", ["xeditable", "ngMockE2E"]);

app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('Ctrl', function($scope, $filter, $q, $http) {
    $scope.tasks = [
        {name: 'task1', period: 2, WCET: 1, offset: 0, deadline: 2},
        {name: 'task2', period: 4, WCET: 1, offset: 0, deadline: 2},
        {name: 'task3', period: 2, WCET: 1, offset: 0, deadline: 2}
    ];

    // mark user as deleted
    $scope.deleteUser = function(id) {
        var filtered = $filter('filter')($scope.users, {id: id});
        if (filtered.length) {
            filtered[0].isDeleted = true;
        }
    };

    // add user
    $scope.addTask = function() {
        $scope.tasks.push({
            name: "New Task" + $scope.tasks.length+1,
            period: 0,
            WCET: 0,
            offset: 0,
            deadline: 0
        });
    };

    // cancel all changes
    $scope.cancel = function() {
        for (var i = $scope.users.length; i--;) {
            var user = $scope.users[i];
            // undelete
            if (user.isDeleted) {
                delete user.isDeleted;
            }
            // remove new
            if (user.isNew) {
                $scope.users.splice(i, 1);
            }
        };
    };

    // save edits
    $scope.saveTable = function() {
        var results = [];
        for (var i = $scope.tasks.length; i--;) {
            var user = $scope.tasks[i];
            // actually delete user
            if (user.isDeleted) {
                $scope.tasks.splice(i, 1);
            }
            // mark as not new
            if (user.isNew) {
                user.isNew = false;
            }

            // send on server
            results.push($http.post('/saveUser', user));
        }

        render_schedule(schedule({tasks:$scope.tasks}));

        return $q.all(results);
    };
});

// ------------ mock $http requests ---------------------
app.run(function($httpBackend) {
    $httpBackend.whenGET('/groups').respond([
        {id: 1, text: 'user'},
        {id: 2, text: 'customer'},
        {id: 3, text: 'vip'},
        {id: 4, text: 'admin'}
    ]);

    $httpBackend.whenPOST(/\/saveUser/).respond(function(method, url, data) {
        data = angular.fromJson(data);
        return [200, {status: 'ok'}];
    });
});