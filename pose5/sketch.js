let poseNet;
let poses = [];
let sample;
let status;

let phase = 0;
let zoff = 0;
let slider;

		let noiseMax = 1;
let blobParts = ['rightEye', 'leftEye', 'leftShoulder', 'rightShoulder'];

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

let options = {
	minConfidence: 0.9,
	maxPoseDetections: 1,
};
// curl -H "Authorization: YOUR_API_KEY" \
//  "https://api.pexels.com/videos/search?query=nature&per_page=1"
const sampleVideoSource =
	'https://api.pexels.com/videos/search?query=dance&per_page=25';
const pexelsApiKey = '563492ad6f91700001000001a03bbcffe1274ec3b613ef62e8fc0120';

/*

************************************************************

*/

/**
 * Starts the webcam and calls webcamReady()
 *
 */
function getNewWebcam() {
	status.html('in getNewWebcam()');
	// Todo: disable buttons until we're ready to try again
	sample = createCapture(VIDEO, webcamReady);
}

/**
 * Handles the webcam feed
 */
function webcamReady() {
	status.html('in webcamReady()');

	select('#webcam-preview-placeholder').html('');
	sample.parent('webcam-preview-placeholder');

	poseNet = ml5.poseNet(sample, options, modelReady);
	poseNet.on('pose', function (results) {
		poses = results;
	});
}

function modelReady() {
	status.html('Model ready');
}

function setup() {
	// Crude attemp at adaptive canvas
	let elWidth = select('#sketch-placeholder').width;
	var canvas = createCanvas(elWidth, elWidth * 0.9);
	canvas.parent('sketch-placeholder');

	// slider = createSlider(0, 1, 0.01, 0.01);
	status = select('#status');

	// Get a sample on load
	getNewWebcam();
}

function draw() {
	background(225);

	// drawKeypoints();
	// drawSkeleton();
	drawFaceBlob();
	// drawBodyBlob();
}

function drawFaceBlob() {
	/**
	 * Loop through all poses
	 */
	for (let i = 0; i < poses.length; i++) {
		/**
		 * load each pose into p
		 */
		let p = poses[i].pose;

		let radius = 20;
		noFill();
		stroke(255);
		strokeWeight(1);

		/**
		 * Draw blob shape around nose
		 */
		push()
		translate(p.nose.x, p.nose.y);
		stroke(0);
		strokeWeight(2);
		noFill();
		beginShape();
		for (let a = 0; a < TWO_PI; a += 0.2) {
			let xoff = map(cos(a + phase), -1, 1, 0, noiseMax);
			let yoff = map(sin(a + phase), -1, 1, 0, noiseMax);
			let r = map(noise(xoff, yoff, zoff), 0, 1, 100, 200);

			let x = r * cos(a);
			let y = r * sin(a);
			vertex(x, y);
		}

		endShape(CLOSE);
		phase += 0.01;
		zoff += 0.001;
pop()
		/**
		 * Draw blob shape based on blobParts array with predefined points
		 */
		// create vectors from the points in the array
		// create a loop to go through each point
		// map the index to an angle (?) that can be used with the cos/sin functions
		// that's it?
	}
}

function drawBodyBlob() {


	let points = [ ]
	
	poses.forEach((p) => {
		p = p.pose;
		points = [
			createVector(p.leftEye.x, p.leftEye.y),
			createVector(p.rightEye.x, p.rightEye.y),
			createVector(p.rightShoulder.x, p.rightShoulder.y),
			createVector(p.leftShoulder.x, p.leftShoulder.y)
		]
	})

	translate(width/2,height/2)
	stroke(100)
	strokeWeight(20)
	beginShape()
	points.forEach((p, i) => {
		let noiseMax = 1
		let a = map(i, 0, points.length, 1, 360);
		let xoff = map(cos(a), -1, 1, 0, noiseMax);
		let yoff = map(sin(a), -1, 1, 0, noiseMax);
		let r = map(noise(xoff, yoff, zoff), 0, 1, 0.8, 1.2);
		let x = p.x * cos(a)*r;
		let y = p.y * sin(a)*r;
		vertex(x, y);
	});
	endShape(CLOSE);
	zoff+=0.001
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
			if (keypoint.score > 0.2) {
				fill(0, 0, 255);
				noStroke();
				ellipse(keypoint.position.x, keypoint.position.y + 100, 9, 9);
			}
		}
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
			stroke(255, 0, 0);
			strokeWeight(4);
			line(
				partA.position.x,
				partA.position.y + 100,
				partB.position.x,
				partB.position.y + 100
			);
		}
	}
}
