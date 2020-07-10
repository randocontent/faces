let faceapi;
let video;
let detections;
let slider;
let slider2;

// by default all options are set to true
const detectionOptions = {
	withLandmarks: true,
	withDescriptors: false,
};

function setup() {
	createCanvas(800, 600);

	slider = createSlider(0, 255, 120);
	slider2 = createSlider(0, 100, 50);
	// load up your video
	video = createCapture(VIDEO);
	video.size(width, height);
	video.hide(); // Hide the video element, and just show the canvas
	faceapi = ml5.faceApi(video, detectionOptions, modelReady);
	textAlign(RIGHT);
}

function modelReady() {
	console.log("ready!");
	console.log(faceapi);
	faceapi.detect(gotResults);
}

function gotResults(err, result) {
	if (err) {
		console.log(err);
		return;
	}
	// console.log(result)
	detections = result;

	// background(220);
	background(255);
	image(video, 0, 0, width, height);
	if (detections) {
		if (detections.length > 0) {
			// console.log(detections)
			// drawBox(detections);
			drawLandmarks(detections);
		}
	}
	faceapi.detect(gotResults);
}

function drawBox(detections) {
	for (let i = 0; i < detections.length; i += 1) {
		const alignedRect = detections[i].alignedRect;
		const x = alignedRect._box._x;
		const y = alignedRect._box._y;
		const boxWidth = alignedRect._box._width;
		const boxHeight = alignedRect._box._height;

		noFill();
		stroke(161, 95, 251);
		strokeWeight(2);
		rect(x, y, boxWidth, boxHeight);
	}
}

function drawLandmarks(detections) {
	for (let i = 0; i < detections.length; i += 1) {
		const mouth = detections[i].parts.mouth;
		const nose = detections[i].parts.nose;
		const leftEye = detections[i].parts.leftEye;
		const rightEye = detections[i].parts.rightEye;
		const rightEyeBrow = detections[i].parts.rightEyeBrow;
		const leftEyeBrow = detections[i].parts.leftEyeBrow;

		drawPart(mouth, true, "yellow");
		drawPart(leftEyeBrow, false, "yellow");
		drawPart(rightEyeBrow, false, "yellow");
		drawPart(leftEye, true, "purple");
		drawPart(rightEye, true, "purple");
		drawNose(nose, false, "blue");
	}
}

function drawPart(feature, closed, color) {
	// beginShape();
	strokeWeight(slider.value());
	stroke(color);
	for (let i = 0; i < feature.length; i += 1) {
		point(feature[i]._x, feature[i]._y);
	}
}

function drawNose(feature, closed, color) {
	// beginShape();
	// strokeWeight(slider.value());
	strokeWeight(10);
	stroke(color);
	noFill();
	for (let i = 0; i < feature.length; i += 1) {
		circle(
			feature[i]._x + random(0 - slider2.value(), slider2.value()),
			feature[i]._y + random(0 - slider2.value(), slider2.value()),
			slider.value() * random(),
		);
	}
}
