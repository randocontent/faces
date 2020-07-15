var img;

function preload() {
	img = loadImage('../pose2-img/yellow.jpg');
}

function setup() {
	createCanvas(600, 400);
	background(220);

	img.width = 600;
	console.dir(img)
}

function draw() {
	image(img,0,0);
}
