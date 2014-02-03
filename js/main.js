workload = {
    tasks: [
        {
            name: "task1",
            period:4,
            WCET:2,
            offset:0,
            deadline:4
        },
        {
            name: "task2",
            period:6,
            WCET:3,
            offset:0,
            deadline:6
        }
    ]
};

render_schedule(schedule(workload));