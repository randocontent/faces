let img;
let poseNet;
let poses = [];

let faceParts = ['rightEye', 'leftEye', 'nose', 'rightEar', 'leftEar'];

let torsoParts = [
	'rightShoulder',
	'leftShoulder',
	'rightElbow',
	'leftElbow',
	'rightWrist',
	'leftWrist',
];

let legParts = [
	'rightHip',
	'leftHip',
	'rightKnee',
	'leftKnee',
	'leftAnkle',
	'rightAnkle',
];

let phase = 0;
let zoff = 0;
let slider;

function setup() {
	createCanvas(640, 960);
	slider = createSlider(0, 1, 3, 0.1);

	// create an image using the p5 dom library
	// call modelReady() when it is loaded
	img = createImg(
		'https://source.unsplash.com/640x960/?person,full,body',
		'',
		'',
		imageReady
	);
	img.size(640, 960);

	img.hide(); // hide the image in the browser
	// frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case
}

// when the image is ready, then load up poseNet
function imageReady() {
	// set some options
	let options = {
		imageScaleFactor: 1,
		minConfidence: 0.1,
		maxPoseDetections: 1,
	};

	// assign poseNet
	poseNet = ml5.poseNet(modelReady, options);
	// This sets up an event that listens to 'pose' events
	poseNet.on('pose', function (results) {
		poses = results;
	});
}

// when poseNet is ready, do the detection
function modelReady() {
	select('#status').html('Model Loaded');

	// When the model is ready, run the singlePose() function...
	// If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results
	// in the draw() loop, if there are any poses, then carry out the draw commands
	poseNet.singlePose(img);
}

// draw() will not show anything until poses are found
function draw() {
	if (poses.length > 0) {
		image(img, 0, 0, 640, 960);
		// drawSkeleton(poses);
		drawBlob(poses);
		drawKeypoints();
	}
}

function blob(posX, posY, radius) {
	push();
	translate(posX, posY);
	stroke(0);
	strokeWeight(2);
	noFill();
	beginShape();
	let noiseMax = 1;
	for (let a = 0; a < TWO_PI; a += radians(26)) {
		let xoff = map(cos(a + phase), -1, 1, 0, noiseMax);
		let yoff = map(sin(a + phase), -1, 1, 0, noiseMax);
		let r = map(noise(xoff, yoff, zoff), 0, 1, radius, height / 2);
		let x = r * cos(a);
		let y = r * sin(a);
		vertex(x, y);
	}
	endShape(CLOSE);
	phase += 0.003;
	zoff += 0.01;

	pop();
}

function hexagon(posX, posY, radius) {
	const rotAngle = TWO_PI / 6;
	stroke('red');
	beginShape();
	for (let i = 0; i < 6; i++) {
		const thisVertex = pointOnCircle(posX, posY, radius, i * rotAngle);
		vertex(thisVertex.x, thisVertex.y);
	}
	endShape(CLOSE);
}

function pointOnCircle(posX, posY, radius, angle) {
	const x = posX + radius * cos(angle);
	const y = posY + radius * sin(angle);
	return createVector(x, y);
}

// The following comes from https://ml5js.org/docs/posenet-webcam
// A function to draw ellipses over the detected keypoints
function drawBlob() {
	// Loop through all the poses detected
	for (let i = 0; i < poses.length; i++) {
		// For each pose detected, loop through all the keypoints
		let p = poses[i].pose;

		let radius = 100;
		noFill();
		stroke(255);
		strokeWeight(1);
		// hexagon(p.rightShoulder.x, p.rightShoulder.y, radius);
		// hexagon(p.leftShoulder.x, p.leftShoulder.y, radius);
		// hexagon(p.nose.x, p.nose.y, radius);

		// beginShape();
		// vertex(p.rightShoulder.x, p.rightShoulder.y);
		// vertex(p.nose.x, p.nose.y);
		// vertex(p.leftShoulder.x, p.leftShoulder.y);
		// endShape(CLOSE);
		push();
		translate(p.nose.x, p.nose.y);
		stroke(0);
		strokeWeight(2);
		noFill();
		beginShape();
		let noiseMax = slider.value();
		for (let a = 0; a < TWO_PI; a += radians(26)) {
			let xoff = map(cos(a + phase), -1, 1, 0, noiseMax);
			let yoff = map(sin(a + phase), -1, 1, 0, noiseMax);
			let r = map(noise(xoff, yoff, zoff), 0, 1, radius, height / 2);
			let x = r * cos(a);
			let y = r * sin(a);
			curveVertex(x, y);
		}
		endShape(CLOSE);
		phase += 0.003;
		zoff += 0.01;
		pop();

		torsoParts.forEach(part => {
			// hexagon(round(p[part].x), round(p[part].y), radius);
		});

		legParts.forEach(part => {
			// ellipse(round(p[part].x), round(p[part].y), radius);
		});

		// for (let j = 0; j < pose.keypoints.length; j++) {
		//     // A keypoint is an object describing a body part (like rightArm or leftShoulder)
		//     let keypoint = pose.keypoints[j];
		//     // Only draw an ellipse is the pose probability is bigger than 0.2
		//     if (keypoint.score > 0.2) {
		// 			noFill()
		//         stroke(20);
		//         strokeWeight(1);
		// ellipse(round(keypoint.position.x), round(keypoint.position.y), 100, 100);
		//     }
		// }
	}
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
	// Loop through all the poses detected
	for (let i = 0; i < poses.length; i++) {
		// For each pose detected, loop through all the keypoints
		let pose = poses[i].pose;
		for (let j = 0; j < pose.keypoints.length; j++) {
			// A keypoint is an object describing a body part (like rightArm or leftShoulder)
			let keypoint = pose.keypoints[j];
			// Only draw an ellipse is the pose probability is bigger than 0.2
			if (keypoint.score > 0.1) {
				fill(0, 0, 255);
				noStroke();
				ellipse(keypoint.position.x, keypoint.position.y, 9, 9);
			}
		}
		push();
		beginShape();
		for (let j = 0; j < pose.keypoints.length; j++) {
			// A keypoint is an object describing a body part (like rightArm or leftShoulder)
			let keypoint = pose.keypoints[j];
			// Only draw an ellipse is the pose probability is bigger than 0.2
			if (keypoint.score > 0.1) {
				noFill();
				stroke('red');
				strokeWeight(3);

				curveVertex(keypoint.position.x, keypoint.position.y);
			}
		}
		endShape(CLOSE);
		pop();
	}
}
// A function to draw the skeletons
function drawSkeleton() {
	// Loop through all the skeletons detected
	for (let i = 0; i < poses.length; i++) {
		let skeleton = poses[i].skeleton;
		// For every skeleton, loop through all body connections
		for (let j = 0; j < skeleton.length; j++) {
			let partA = skeleton[j][0];
			let partB = skeleton[j][1];
			stroke(255);
			strokeWeight(1);
			line(
				partA.position.x,
				partA.position.y,
				partB.position.x,
				partB.position.y
			);
		}
	}
}
