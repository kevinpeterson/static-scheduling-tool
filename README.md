Static Scheduling Tool
======================

A Javascript based online Non-Preemptive Deadline Monotonic Scheduling tool.

[Try it!](http://kevinp.me/static-scheduling-tool/)
--------------

Job Priority Algorithm Steps
--------------
 
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


Job Scheduling Algorithm Steps
--------------
 
1. Start a simulated clock.
2. Give the job queue from function 'schedule,' get the first job in the queue.
3. Start simuluation of the current job. Note the current time as its 'start' time,
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

