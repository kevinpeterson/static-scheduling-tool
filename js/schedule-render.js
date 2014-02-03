function render_schedule(schedule) {
    var canvas = document.getElementById('schedule');
    var slot_size = canvas.width / schedule.hyperperiod_size;
    slot_size = slot_size > 50 ? 50 : slot_size;

    var padding = 5;

    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        var tasks = schedule.workload.tasks;

        var colors = {};

        tasks.sort(function(a, b){return a.period - b.period});

        for(var i=0;i<tasks.length;i++){
            var context = canvas.getContext('2d');

            var frequency = .3;
            var red = Math.floor(Math.sin(frequency*(i*5) + 0) * 127) + 128;
            var green = Math.floor(Math.sin(frequency*(i*5) + 2) * 127) + 128;
            var blue = Math.floor(Math.sin(frequency*(i+5) + 4) * 127) + 128;

            var color = "rgb("+red+","+green+","+blue+")";

            var task = tasks[i];
            colors[task.name] = color;

            var periods = schedule.hyperperiod_size / task.period;

            context.beginPath();
            for(var j=0;j<periods;j++){
                context.strokeStyle = color;
                var step_size = task.period * slot_size;
                context.moveTo(padding + j * step_size, 160 + (i * 20));
                context.lineTo(padding + j * step_size, 180 + (i * 20));
                context.moveTo(padding + j * step_size, 170 + (i * 20));
                context.lineTo(padding + j * step_size + step_size, 170 + (i * 20));
                context.moveTo(padding + j * step_size + step_size, 180 + (i * 20));
                context.lineTo(padding + j * step_size + step_size, 160 + (i * 20));
                context.stroke();
            }

            context.fillStyle = color;
            context.fillText(task.name, padding + schedule.hyperperiod_size * slot_size + 10, 170 + (i * 20));
            context.closePath();
        }

        var jobs = schedule.schedule;
        for(var i=0;i<jobs.length;i++){
            var job = jobs[i];
            var context = canvas.getContext('2d');
            context.fillStyle = colors[job.task];
            context.fillRect(padding + slot_size*job.start,100,slot_size*(job.end-job.start),slot_size);
        }

        for(var i=0;i<schedule.hyperperiod_size;i++){
            var context = canvas.getContext('2d');
            context.lineWidth = 2;
            context.strokeStyle = 'black';
            context.strokeRect(padding + slot_size*i,100,slot_size,slot_size);
        }

    } else {
        // put code for browsers that don’t support canvas here
        alert("This page uses HTML 5 to render correctly. Other browsers may not see anything.");
    }
}