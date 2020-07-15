let img, capture;

function startWebcam() {
	capture = createCapture(VIDEO);
	capture.size(320, 240);
	capture.hide();
}
function setup() {
	hold = document.getElementById('sketch-placeholder');
	placeholderW = hold.clientWidth;
	placeholderH = hold.clientHeight;
var canvas = createCanvas(placeholderW,placeholderH);
canvas.parent('sketch-placeholder')
	console.log(width)
	console.log(height)
	// startWebcam();

	// mousePressed can accept a function name (not a function call) as an argument
	// https://p5js.org/reference/#/p5.Element/mousePressed
}

function draw() {
	background(255);
	if (capture) {
		image(capture, 0, 0, 320, 240);
	}
	filter(POSTERIZE,2);
}
