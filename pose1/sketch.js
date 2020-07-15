let img, capture, startButton, posePreview;

function startWebcam() {
	capture = createCapture(VIDEO);
	capture.size(320, 240);
	select('#webcam-preview-placeholder').html('')
	capture.parent('webcam-preview-placeholder')
	// capture.hide();
}

function setup() {
	var canvas = createCanvas(400,400);
	canvas.parent('sketch-placeholder');
	startWebcam();

	// mousePressed can accept a function name (not a function call) as an argument
	// https://p5js.org/reference/#/p5.Element/mousePressed

	startButton = select('#redo')
	startButton.mousePressed(startWebcam)
}

function draw() {
	background(255);
	if (capture) {
		// image(capture, 100, 100, 320, 240);
		
	}
	filter(POSTERIZE, 2);
}
