function Land(imageSrc){
    console.log(imageSrc);
    var land = {
        src : imageSrc,
        picture : new Image(),
        isReady : false,
        readyToRender : function(){
            return land.isReady;
        },
        onload: function(){
          land.isReady = true;
        },
        renderFunction : function (scene,context){
            context.fillStyle = context.createPattern(land.picture, 'repeat');

            context.fillRect(-scene.bufferSize, -scene.bufferSize, scene.width + scene.bufferSize*2, scene.height + scene.bufferSize*2);
        }
    };

    land.picture.onload = land.onload;
    land.picture.src = land.src;
    return land;
}