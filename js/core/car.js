function Car (imageSrc, engineSoundSrc){
    var RADIAN_MAX_VALUE = 360 * Math.PI / 180;

    var isLeftPressed = false,
        isRightPressed = false,
        isUpPressed = false,
        isDownPressed = false;

    var wheelAxeSampleRate = 30,
        wheelAxeStep = 0.2;

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


    function bindKeys(){
        $(document.body).on("keydown keyup",function(e){

            switch(e.keyCode){
                case 37://left
                    isLeftPressed = e.type == "keydown";
                   // car.angle =  (car.angle - 5) % 360;
                    break;
                case 39://right
                    isRightPressed = e.type == "keydown";
                   // car.angle =  (car.angle + 5) % 360;
                    break;
                case 38://top
                    isUpPressed = e.type == "keydown";
                   // car.radius = car.radius + 1;
                    break;

                case 40://down
                    isDownPressed = e.type == "keydown";
                  //  car.radius = Math.max(0,car.radius - 1);
                    break;

            }
        });
    }

    function engineLoopSound(timestamp){
        var progress = timestamp - car.audio.engine.lastSample;
        if (car.audio.engine.lastSample == 0){
            car.audio.engine.ctrl.play();
            car.audio.engine.lastSample = timestamp;
        }
        if (progress >= car.audio.engine.duration * car.audio.engine.ctrl.playbackRate ){
            car.audio.engine.ctrl.currentTime = 0;
            car.audio.engine.ctrl.play();
            car.audio.engine.lastSample = timestamp;

        }

        requestAnimationFrame(engineLoopSound);
    }

    function updateWheelAxe (timestamp){
        var progress = timestamp - car.wheelAxeLastSample;
        var absValue = 0;

        if (progress > wheelAxeSampleRate){
            car.wheelAxeLastSample = timestamp;
            if (isLeftPressed){
                car.wheelsAxeEmphasis -= wheelAxeStep;
            }else if (isRightPressed){
                car.wheelsAxeEmphasis += wheelAxeStep;
            }else if (Math.abs(car.wheelsAxeEmphasis) > wheelAxeStep) {
                car.wheelsAxeEmphasis += (car.wheelsAxeEmphasis > 0 ? -wheelAxeStep : wheelAxeStep) ;
            }else{
                car.wheelsAxeEmphasis = 0;
            }

            //min value calculated based on the absolute value and we reset negative if needed. this avoid of dealing whit both min and max;
            car.wheelsAxeEmphasis  = Math.min(car.specs.maxWheelAxe,Math.abs(car.wheelsAxeEmphasis) )  * (car.wheelsAxeEmphasis < 0 ?  -1: 1);


        }

        requestAnimationFrame(updateWheelAxe);

    }
    function updateVelocity(timestamp){
        var progress = timestamp - car.lastSample;

        if (progress > car.specs.acceleration){

            car.lastSample = timestamp;

            var direction = (car.radius < 0 ? -1: 1);
            //if pressing up, accelerate, or else decelerate
            if (isUpPressed){
                car.radius = Math.min(car.specs.topSpeed,car.radius + 1);
            }else if (isDownPressed){
                car.radius = Math.max(-car.specs.topReverseSpeed,car.radius - 1);
            }else {
                car.radius = Math.max(0,Math.abs(car.radius) - car.specs.deceleration) * direction;
            }

            car.angle = (car.angle + (Math.min(Math.abs(car.wheelsAxeEmphasis) , Math.abs(car.radius) * car.specs.maxWheelAxe/30)) * (car.wheelsAxeEmphasis < 0 ?  -1: 1) * direction) % 360;

            var teta = car.angle * Math.PI / 180;
//

            //get the max emphasis for going at 30



            car.posX += car.radius * Math.cos(teta);
            car.posY += car.radius * Math.sin(teta);

            car.velocity = car.radius;
        }
        requestAnimationFrame(updateVelocity);
    }

    /*function updateWheelAxe(timestamp){
        var progress = timestamp - car.wheelAxeLastSample;

        if (progress - i)
    }*/

    var car =  {
        lastSample : 0,
        wheelAxeLastSample : 0,
        src : imageSrc,
        picture : new Image(),
        scaleFactor : 2,
        radius : 0,
        angle : 0,
        posX : 0,
        posY : 0,
        velocity : 0,
        wheelsAxeEmphasis: 0,
        centerX : 0,
        centerY : 0,
        wheelbase : 0,
        rearWheelsOffset: 0,
        isReady:false,
        readyToRender : function(){
            return car.isReady;
        },
        onload :function(){
            car.isReady = true;
            car.rearWheelsOffset = car.picture.width / car.scaleFactor / 2 * (0.5 - car.specs.rearWheelsPosition);
            car.centerX = - car.picture.width / 2 / car.scaleFactor + car.rearWheelsOffset;
            car.centerY = -  car.picture.height / 2 / car.scaleFactor;

            requestAnimationFrame(updateWheelAxe);
            requestAnimationFrame(updateVelocity);
        },
        audio : {
            engine :{
                lastSample : 0,
                src : engineSoundSrc || "audio/car_idle.wav",
                ctrl : document.createElement("audio")    
            } 
            
        },

        renderFunction : function(scene,context){
            context.translate(canvas.width / 2 - car.rearWheelsOffset  ,canvas.height / 2 );
            context.rotate( car.angle  * Math.PI / 180 );

            context.drawImage(
                car.picture,
                car.centerX,
                car.centerY ,
                car.picture.width / car.scaleFactor,
                car.picture.height / car.scaleFactor );

            context.translate(0,0);
        },
        specs : {
            rearWheelsPosition : 0.25, // in percentage, the distance from the back of the car were the rotation should be centered
            frontWheelsPosition : 0.1, //in percentage the distance from the front of the car, were the movement radius should be starting
            acceleration : 30, //affects the sampling rate, lower means faster
            deceleration : 0.2, //affects the deceleration based on the sampling rate, when no keys are pressed
            topSpeed : 80, //sets the maximum radius for a sample when going forward
            topReverseSpeed : 50, // sets the max radius for a sample when going reverse
            handling : 2, // determine the angle variation in degrees on sampling
            maxWheelAxe : 3.5
        }
    };

    bindKeys();

    //car.audio.engine.ctrl.style.display="none";
    //car.audio.engine.ctrl.setAttribute("loop","false");
    //car.audio.engine.ctrl.setAttribute("autoplay","true");

    document.body.appendChild(car.audio.engine.ctrl);

    car.audio.engine.ctrl.addEventListener('canplaythrough', function() {

        car.audio.engine.duration = car.audio.engine.ctrl.duration * 1000;
        //requestAnimationFrame(engineLoopSound);
    }, false);

    car.audio.engine.ctrl.setAttribute("src",car.audio.engine.src);

    car.picture.onload = car.onload;
    car.picture.src = car.src;


    return car;

}