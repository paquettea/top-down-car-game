
var canvas = document.getElementById("car-canvas");

$(canvas).attr("width", $(window).width()-10);
$(canvas).attr("height",  $(window).height()-10);


var context = canvas.getContext('2d');

var car = new Car("car-top-view4.png");
var scene = new Scene($(canvas).attr("width"),$(canvas).attr("height"),context, car);
var road = new Road();
var land = new Land("grass-00-seamless-low-res.jpg");


var carLayer = new Layer(car);

car.layer = carLayer;

scene.layers.push(new Layer(land));
scene.layers.push(new Layer(road));
scene.layers.push(carLayer);

scene.start();