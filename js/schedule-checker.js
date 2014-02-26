/*
 Checks a generated schedule for correctness.

 The following requirements are verified:
 Check your generated schedule to confirm that every job for every task
 executes at its required period between its required offset and deadline constraints,
 that the interval reserved in the schedule for
 every job is large enough for its WCET, and that the
 execution of no two jobs ever overlap
*/

/*
 Check the various conditions required for a workload to be schedulable.
 */
function is_schedulable(schedule){
    return (check_cpu_utilization(schedule.workload.tasks) <= 1)
        &&
        (check_each_task_executes_in_period(schedule).total_result)
        &&
        (check_no_jobs_overlap(schedule))
        &&
        (check_no_jobs_unscheduled(schedule).length == 0)
        &&
        (check_job_intervals(schedule));
}


/*
 Ensure that jobs of tasks execute within period deadlines, respecting
 offset and deadline times (if different than the period).
 */
function check_each_task_executes_in_period(schedule){
    var results = {};

    var tasks = schedule.workload.tasks;

    var result = true;

    for(var i=0;i<tasks.length;i++){
        var task = tasks[i];

        var periods = schedule.hyperperiod_size / task.period;

        var missed_deadlines = [];

        var counter = 0;
        for(var j=0;j<periods;j++){
            var period_start = j*task.period;
            var period_end = period_start + task.period;

            // find a job in the period and make sure it starts >= its offset
            // and ends <= its deadline. If not, add it to the 'missed deadlines' list to report back
            var job = find_job_in_period(period_start, period_end, task.name, schedule.schedule);
            if(job){
                if((job.start >= (period_start + task.offset))
                    &&
                    (job.end <= (period_start + task.deadline))){
                    counter++;
                } else {
                    missed_deadlines.push(job);
                }
            }
        }
        if(counter === periods && missed_deadlines.length == 0){
            results[task.name] = {ok: true, missed_deadlines: []};
        } else {
            result = false;
            results[task.name] = {ok: true, missed_deadlines: missed_deadlines};
        }
    }

    return {total_result: result, task_results: results};
}


/*
 Initialize an array of 0's of a given size.
 */
function initialize_empty_array(size){
    var zeros = [];
    for (var i = 0; i < size; i++) zeros[i] = 0;
    return zeros;
}


/*
 Make sure no jobs have be left 'unscheduled' - or, could not fit in the hyperperiod.
 */
function check_no_jobs_unscheduled(schedule){
    return schedule.overrun;
}


/*
 Make sure no two jobs are executing at the same time.
 */
function check_no_jobs_overlap(schedule){
    var timing_arrays = []

    var jobs = schedule.schedule;

    for(var i=0;i<jobs.length;i++){
        var timing_array = initialize_empty_array(schedule.hyperperiod_size);
        var job = jobs[i];
        for(j=job.start;j<job.end;j++){
            timing_array[j] = 1;
        }
        timing_arrays.push(timing_array);
    }

    // initialize an array of '0's equal to the hyperperiod size
    var check_array = initialize_empty_array(schedule.hyperperiod_size);

    // increment that slot in the array if a running job occupies that time slot
    for(var i=0;i<timing_arrays.length;i++){
        for(var j=0;j<timing_arrays[i].length;j++){
            check_array[j] = check_array[j] + timing_arrays[i][j];
        }
    }

    // if any slot is greater than 1, it means two or more jobs were executing in that slot
    for(var i=0;i>check_array.length;i++){
        if(check_array[i] > 1){
            return false;
        }
    }

    return true;
}


/*
 Given a start/end clock time, a task definition (WCET, offset, deadline, period),
 find a job that can execute within that start/end time.
 */
function find_job_in_period(start, end, task, jobs){
    for(var i=0;i<jobs.length;i++){
        var job = jobs[i];
        if(job.task === task && job.start >= start && job.start < end){
            return job;
        }
    }
    return null;
}


/*
 Ensure that enough time has been allocated to allow for the required WCET.
 */
function check_job_intervals(schedule){
    var tasks = schedule.workload.tasks;

    var tasks_obj = {};
    for(var i=0;i<tasks.length;i++){
        var task = tasks[i];
        tasks_obj[task.name] = task
    }

    var jobs = schedule.schedule;

    for(var i=0;i<jobs.length;i++){
        var job = jobs[i];

        // calculate the intervale and make sure the WCET can fit
        var interval = job.end - job.start;
        if(interval < tasks_obj[job.task].WCET){
            return false;
        }
    }

    return true;
}


/*
 Calculate CPU utilization for a set of tasks in a workload.
 */
function check_cpu_utilization(tasks){
    var total_utilization = 0;

    for(var i=0;i<tasks.length;i++){
        var task = tasks[i];
        var utilization = task.WCET / task.period;

        total_utilization += utilization;
    }

    return total_utilization;

}