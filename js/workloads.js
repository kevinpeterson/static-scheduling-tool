/*

*/
var workloads = [
    {
        name: "Test Workload",
        tasks: [
            {id: 0, name: 'task1', period: 3, WCET: 1, offset: 0, deadline: 3},
            {id: 1, name: 'task2', period: 4, WCET: 1, offset: 0, deadline: 4},
            {id: 2, name: 'task3', period: 6, WCET: 1, offset: 0, deadline: 6}
        ]
    },
    {
        name: "Workload 1",
        tasks: [
            {id: 0, name: 'task1', period: 10, WCET: 2, offset: 0, deadline: 10},
            {id: 1, name: 'task2', period: 10, WCET: 2, offset: 0, deadline: 10},
            {id: 2, name: 'task3', period: 20, WCET: 1, offset: 5, deadline: 20},
            {id: 3, name: 'task4', period: 20, WCET: 2, offset: 5, deadline: 20},
            {id: 4, name: 'task5', period: 40, WCET: 2, offset: 5, deadline: 30},
            {id: 5, name: 'task6', period: 40, WCET: 2, offset: 5, deadline: 30},
            {id: 6, name: 'task7', period: 80, WCET: 2, offset: 10, deadline: 60},
            {id: 7, name: 'task8', period: 80, WCET: 2, offset: 10, deadline: 60}
        ]
    },
    {
        name: "Workload 2",
        tasks: [
            {id: 0, name: 'task1', period: 20, WCET: 4, offset: 0, deadline: 15},
            {id: 1, name: 'task2', period: 20, WCET: 1, offset: 5, deadline: 20},
            {id: 2, name: 'task3', period: 30, WCET: 2, offset: 5, deadline: 30},
            {id: 3, name: 'task4', period: 30, WCET: 1, offset: 5, deadline: 30},
            {id: 4, name: 'task5', period: 50, WCET: 1, offset: 10, deadline: 40},
            {id: 5, name: 'task6', period: 50, WCET: 1, offset: 10, deadline: 40},
            {id: 6, name: 'task7', period: 50, WCET: 2, offset: 25, deadline: 50},
            {id: 7, name: 'task8', period: 50, WCET: 5, offset: 25, deadline: 50}
        ]
    }
]