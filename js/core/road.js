function Road(){
    var road ={
        width: 100,
        height: 50,
        paintedLineHeight:1,
        lineColors:{
            exterior : "rgb(225,225,225)",
            interior : "rgb(241,187,56)"
        },
        isReady : false,
        readyToRender : function(){
            return road.isReady;
        },
        onload: function(){
            road.isReady = true;
        },
        renderFunction : function(scene,context){
            var x = -scene.bufferSize;

            context.fillStyle = "rgb(93,93,93)";
            context.fillRect(x ,  scene.height / 2 - rectRatio /2 , scene.width + scene.bufferSize,  rectRatio);


            context.fillStyle = road.lineColors.interior;
            //middle line
            context.fillRect(x ,  scene.height / 2 - paintRatio /2 ,scene.width + scene.bufferSize,  paintRatio);

            context.fillStyle = road.lineColors.exterior;
            //top line
            context.fillRect(x ,  scene.height / 2 - rectRatio /2 ,scene.width + scene.bufferSize,  paintRatio);

            //bottom line
            context.fillRect(x ,  scene.height / 2 + rectRatio /2 - paintRatio ,scene.width + scene.bufferSize,  paintRatio);
        }
    }

    var rectRatio = (scene.height / (100 / road.height))  ;
    var paintRatio = (scene.height / (100 / road.paintedLineHeight))  ;

    road.onload();
    return road;
}