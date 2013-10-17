function Layer (object){
    return {
        isReady : object.readyToRender,
        draw : object.renderFunction
    }
};