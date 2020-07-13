let faceapi;
let video;
let detections;
let r = 10;
let yoff = 0;

// by default all options are set to true
const detectionOptions = {
	withLandmarks: true,
};

function setup() {
	createCanvas(800, 600);
	video = createCapture(VIDEO);
	video.hide();
	faceapi = ml5.faceApi(video, detectionOptions, modelReady);
}

function modelReady() {
	console.log('faceApi ready');
	faceapi.detect(gotResults);
}

function gotResults(err, result) {
	if (err) {
		console.log(err);
		return;
	}
	detections = result;
	image(video, 0,0, width, height)

	// background(255);
	if (detections) {
		if (detections.length > 0) {
			drawBox(detections);
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

		rect(x, y, boxWidth, boxHeight);

		let xoff = 0;
		fill(50);
		noStroke();
		push();
		translate(x, y)
		beginShape();
		for (let a = 0; a < TWO_PI; a += 1) {
			let offset = map(noise(xoff+yoff),0,1,-5,5)
			// let nr = r * offset;
			// let rx = nr * cos(a) * 5;
			// let ry = nr * sin(a) * 5;
			rx = map(cos(a),-1,1,-50,50) + offset;
			ry = map(sin(a),-1,1,-50,50) + offset;
			vertex(rx,ry);
			xoff += 0.1;
		}
		yoff += 0.01;
		endShape();
		// ellipse(50,50,50)
		pop()
	}
}

function drawLandmarks(detections) {
	for (let i = 0; i < detections.length; i += 1) {
		const nose = detections[i].parts.nose;
		const leftEye = detections[i].parts.leftEye;
		const rightEye = detections[i].parts.rightEye;

		drawEye(leftEye);
		drawEye(rightEye);
		
		drawNose(nose);
	}
}

function drawNose(nose) {

}
function drawEye(feature) {
	beginShape();
	for(let i = 0; i < feature.length; i++){
			const x = feature[i]._x
			const y = feature[i]._y
			vertex(x, y)
	}
			endShape(CLOSE);
	

}
