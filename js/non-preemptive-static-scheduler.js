var debug = false;

function hyperperiod_size(workload){
    var tasks = workload.tasks;

    var periods = [];
    for(var i=0;i<tasks.length;i++){
        periods.push(tasks[i].period);
    }

    return LCM_array(periods);
}

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

function LCM(a, b){
    return (a * b) / GCD(a, b);
}

function GCD(a, b){
    if (b === 0) {
        return a;
    } else {
        return GCD(b, a % b);
    }
}

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

function schedule(workload){
    workload = check_input(workload);
    var tasks = workload.tasks;

    tasks = tasks.sort(function(a, b){return a.deadline - b.deadline});

    var hp_size = hyperperiod_size(workload);

    var job_queue = [];

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

    var schedule = simulate_hyperperiod(job_queue.reverse(), hp_size);

    schedule.workload = workload;
    schedule.hyperperiod_size = hp_size;

    return schedule;
}

function simulate_hyperperiod(job_queue, hp_size){
    var schedule = [];

    var current_job = job_queue.pop();

    for(var i=current_job.start;i<hp_size;){
        var running_job = {
            task: current_job.task,
            start: i,
            end: (i + current_job.WCET)
        };
        if(debug) console.log("Running:", running_job.task, " at:", i);
        while(running(running_job, i)){ i++ };
        if(debug) console.log("Ending:", running_job.task, " at:", i);

        schedule.push(running_job);

        current_job = job_queue.pop();
        if(! current_job){
            break;
        } else {
            i = current_job.start > i ? current_job.start : i;
        }
    }

    if(current_job){
        job_queue.push(current_job);
    }

    for(var k=0;k<job_queue.length && debug;k++){
        console.log("Left:", job_queue[k].name);
    }

    return {
        schedule: schedule,
        overrun: job_queue
    };
}

function running(job, clock_tick){
    return ( (job.start <= clock_tick) && (clock_tick < job.end) );
}