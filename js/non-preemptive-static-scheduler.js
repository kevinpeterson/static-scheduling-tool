/*
 Generates a Deadline Monotonic Non-Preemptive Schedule given
 a task list.
 */

// enable extra logging
var debug = false;

/*
 Determine the hyperperiod size for a given workload.
 The hyperperiod is calculated using the Least Common Multiple
 of all period of the workload.
 */
function hyperperiod_size(workload){
    var tasks = workload.tasks;

    var periods = [];
    for(var i=0;i<tasks.length;i++){
        periods.push(tasks[i].period);
    }

    return LCM_array(periods);
}

/*
 Find the Least Common Multiple of an array of numbers.
 */
function LCM_array(arr){
    if(arr.length === 1){
        return arr[0];
    } else {
        var a = arr.shift();
        var b = arr.shift();
        arr.push(LCM(a, b));

        return LCM_array(arr);
    }
}

/*
 Find the Least Common Multiple of two numbers.
 */
function LCM(a, b){
    return (a * b) / GCD(a, b);
}

/*
 Find the Greatest Common Denominator two numbers.
 */
function GCD(a, b){
    if (b === 0) {
        return a;
    } else {
        return GCD(b, a % b);
    }
}

/*
 If not present, assigns 0 to the task offset and
 sets the deadline to the end of the period. Use
 this as the default if offset and/or deadline aren't
 explicitly set.
 */
function check_input(workload){
    for(key in workload){
        var task = workload[key];
        if(! 'offset' in task){
            task.offset = 0;
        }
        if(! 'deadline' in task){
            task.deadline = task.period;
        }
    }

    return workload;
}

/*
 Compute a Deadline Monotonic Non-Preemptive schedule given a workload

 Algorithm Steps
 ===============
 1. Sort the tasks in the workload by deadline, so earliest deadline will have the
 highest priority.
 2. Calculate the hyperperiod of hte workload by taking the Least Common Multiple
 3. Simulate the system clock by stepping through the hyperperiod
 in one time unit increments.
 4. For each time slot, loop through the task priority queue. If
 a job of that task can be scheduled for that time slot, add it to
 a job queue.
 5. The output of step 4 should be a queue of all jobs in the order in which they must
 execute. Next, we'll take this output and simulate the hyperperiod based on a simulated
 system clock (see function 'simulate_hyperperiod').

 */
function schedule(workload){
    workload = check_input(workload);
    var tasks = workload.tasks;

    // sort by deadline to determine priority
    tasks = tasks.sort(function(a, b){return a.deadline - b.deadline});

    // calculate the hyperperiod size
    var hp_size = hyperperiod_size(workload);

    var job_queue = [];

    /*
     Walk through the hyperperiod and push all jobs onto a queue
     according to their priority. Higher priority tasks are in the
     front of the queue.
     */
    for(var i=0;i<hp_size;i++){
        for(var j=0;j<tasks.length;j++){
            var task = tasks[j];
            if(((i - task.offset) % task.period) === 0 && i >= task.offset){
                job_queue.push({
                    task: task.name,
                    start: i,
                    WCET: task.WCET
                });
            }
        }
    }

    if(debug) console.log(job_queue);

    // run the simulation to calculate start/end times for jobs
    var schedule = simulate_hyperperiod(job_queue.reverse(), hp_size);

    schedule.workload = workload;
    schedule.hyperperiod_size = hp_size;

    return schedule;
}

/*
 Simulate a single hyperperiod scheduling based on the priority job
 queue. This will then be used as the static schedule.

 -------------
 ! Important !
 -------------
 There is no guarantee that the schedule produced by this function is valid, or
 that all jobs complete within their given constraints. Any schedule produced here
 should be verified independently (see 'schedule-checker.js').

 Algorithm Steps
 ===============
 1. Start a simulated clock.
 2. Give the job queue from function 'schedule,' get the first job in the queue.
 3. Start simluation of the current job. Note the current time as its 'start' time,
 and record its 'end' time as the 'start' time plus its WCET.
 4. Advance the simulated clock until the job is done running.
 5. Once the the simulation for that job is done, we will know its start and
 end time -- add that to the 'schedule.'
 6. Get the next job out of the queue, set that as the 'current' job, and advance
 the simulated clock to its start time.
 7. Repeat step 3 with the new current job.
 8. If the simulated clock time expires and we still have jobs left to be scheduled,
 add them to an 'overrun' list, so that we can track unschedulable jobs.
 9. Return the simulated schedule.

 */
function simulate_hyperperiod(job_queue, hp_size){
    var schedule = [];

    // get the first job out of the queue
    var current_job = job_queue.pop();

    // step through the hyperperiod
    for(var i=current_job.start;i<hp_size;){

        // get the job and set its start/end times
        var running_job = {
            task: current_job.task,
            start: i,
            end: (i + current_job.WCET)
        };

        if(debug) console.log("Running:", running_job.task, " at:", i);
        // advance the clock while the job is 'running'
        while(running(running_job, i)){ i++ };
        if(debug) console.log("Ending:", running_job.task, " at:", i);

        // add it to the schedule
        schedule.push(running_job);

        // get the next job off the queue (if any)
        current_job = job_queue.pop();
        if(! current_job){
            break;
        } else {
            i = current_job.start > i ? current_job.start : i;
        }
    }

    // if we couldn't actually schedule the last job, push it back on the queue.
    if(current_job){
        job_queue.push(current_job);
    }

    // any job left on the job queue is 'unscheduled'
    for(var k=0;k<job_queue.length && debug;k++){
        console.log("Left:", job_queue[k].name);
    }

    return {
        schedule: schedule,
        overrun: job_queue
    };
}

/*
 A job is running if the clock is between its start(inclusive) and end(exclusive) time
 */
function running(job, clock_tick){
    return ( (job.start <= clock_tick) && (clock_tick < job.end) );
}