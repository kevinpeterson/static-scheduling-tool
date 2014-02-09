var ideal_canvas_width = 1200;

function render_schedule(schedule) {
    var canvas = document.getElementById('schedule');
    var slot_size = (ideal_canvas_width - 100) / schedule.hyperperiod_size;
    slot_size = slot_size > 50 ? 50 : slot_size;
    if(slot_size < 10){
        slot_size = 10;
        canvas.width = slot_size * schedule.hyperperiod_size + 100;
    } else {
        canvas.width = ideal_canvas_width;
    }

    var x_padding = 50;
    var y_padding = 20;

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
                context.moveTo(x_padding + j * step_size, slot_size + y_padding*2 + (i * 20));
                context.lineTo(x_padding + j * step_size, slot_size + y_padding*2 + 20 + (i * 20));
                context.moveTo(x_padding + j * step_size, slot_size + y_padding*2 + 10 + (i * 20));
                context.lineTo(x_padding + j * step_size + step_size, slot_size + y_padding*2 + 10 + (i * 20));
                context.moveTo(x_padding + j * step_size + step_size, slot_size + y_padding*2 + 20 + (i * 20));
                context.lineTo(x_padding + j * step_size + step_size, slot_size + y_padding*2 + (i * 20));
                context.stroke();
            }

            context.fillStyle = color;
            context.font = '18pt Calibri';
            context.fillText(task.name, x_padding + schedule.hyperperiod_size * slot_size + 10, slot_size + y_padding*2 + 10 + (i * 20) + 7);
            context.closePath();
        }

        var number_step_size = Math.ceil(schedule.hyperperiod_size / 20);
        for(var i=0;i<=schedule.hyperperiod_size;i += number_step_size){
            context.beginPath();
            context.font = '12pt Calibri';
            context.strokeStyle = color;
            context.fillText(i.toString(), i*slot_size-6 + x_padding, y_padding - 10);
            context.stroke();
            context.closePath();
        }

        var jobs = schedule.schedule;
        for(var i=0;i<jobs.length;i++){
            var job = jobs[i];
            var context = canvas.getContext('2d');
            context.fillStyle = colors[job.task];
            context.fillRect(x_padding + slot_size*job.start,y_padding,slot_size*(job.end-job.start),slot_size);
        }

        for(var i=0;i<schedule.hyperperiod_size;i++){
            var context = canvas.getContext('2d');
            context.lineWidth = 2;
            context.strokeStyle = 'black';
            context.strokeRect(x_padding + slot_size*i,y_padding,slot_size,slot_size);
        }

    } else {
        // put code for browsers that don’t support canvas here
        alert("This page uses HTML 5 to render correctly. Other browsers may not see anything.");
    }
}