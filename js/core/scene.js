var Scene = function(width,height,context,reference){
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var stats = {
        lastSample : 0,
        framesInOneSeconds : 0,
        el : document.createElement("div")
    }

    stats.el.className = "stats-window";
    document.body.appendChild(stats.el);


    var scene = {
        layers :[],
        width : width,
        height : height,
        bufferSize : width * 2,
        enableScaling : true,
        start : function(){
            requestAnimationFrame(scene.update);
        },
        update : function(timestamp){ //called by requestAnimationFrame
            if (timestamp - stats.lastSample > 1000){
                stats.el.innerHTML = stats.framesInOneSeconds + "FPS";
                stats.framesInOneSeconds = 0;
                stats.lastSample = timestamp;
            }else{
                stats.framesInOneSeconds++;
            }
            context.clearRect(0,0,canvas.width,canvas.height);
            context.save();

            var scaleX = 0;
            var scaleY = 0;
            if (scene.enableScaling){
                scaleX = (50 - reference.velocity/10) / 50;
                scaleY = (50 - reference.velocity/10) / 50;
                context.scale(scaleX, scaleY);
            }

            var hasMoved = false;

            for ( var i = 0 ; i < scene.layers.length ; i++){
                if (scene.layers[i] !== reference.layer && !hasMoved){
                    hasMoved = true;
                    context.translate(-reference.posX,-reference.posY + (scene.height * (1 - scaleY)));
                }else if (scene.layers[i] === reference.layer ) {
                    context.translate(reference.posX,reference.posY);

                    hasMoved = false;
                }

                //avoid the render function to be called when the component is not ready
                if (scene.layers[i].isReady()){
                    scene.layers[i].draw(scene,context);
                }



            }

            context.restore();
            requestAnimationFrame(scene.update);
        }
    };

    return scene;

};
