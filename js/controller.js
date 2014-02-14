var app = angular.module("app", ['ui.validate', 'ngJustGage']);

app.run();

app.controller('Ctrl', function($scope, $filter, $q, $http) {
    $scope.workloads = workloads;
    $scope.workload = workloads[0];

    $scope.tasks = $scope.workload.tasks;

    $scope.$watch('workload', function(){
        $scope.tasks = $scope.workload.tasks;
    }, true);

    $scope.$watch('tasks', function(){
        $scope.schedule();
    }, true);

    // add
    $scope.addTask = function() {
        $scope.tasks.push({
            id: $scope.tasks.length,
            name: "New Task " + ($scope.tasks.length+1).toString(),
            period: 4,
            WCET: 1,
            offset: 0,
            deadline: 4
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
        if($scope.workloadForm.$valid){
            var schedule_ = schedule({tasks:$scope.tasks});
            render_schedule(schedule_);
            $scope.cpu_utilization = Math.round(check_cpu_utilization($scope.tasks) * 100);
            $scope.schedulable = is_schedulable(schedule_);
            $scope.check_no_jobs_unscheduled = check_no_jobs_unscheduled(schedule_);
            $scope.check_each_task_executes_in_period = check_each_task_executes_in_period(schedule_);
            $scope.check_no_jobs_overlap = check_no_jobs_overlap(schedule_);
            $scope.check_job_intervals = check_job_intervals(schedule_);
        }
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

