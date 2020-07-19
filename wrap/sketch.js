let hull = [];
let index;

let poseNet;
let poses = [];
let sample;
let status;

let phase = 0;
let zoff = 0;
let slider;

let options = {
	minConfidence: 0.1,
};


let leftMost;
let currentVertex;
let nextVertex;

function setup() {

leftMost = createVector()
currentVertex = createVector()
nextVertex = createVector()

	// Crude attemp at adaptive canvas
	let elWidth = select('#sketch-placeholder').width;
	var canvas = createCanvas(elWidth, elWidth * 0.9);
	canvas.parent('sketch-placeholder');

	slider = createSlider(0, 3, 1, 0.1);
	status = select('#status');

	// Get a sample on load
	getNewWebcam();
}
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

function draw() {
	background(225);

	// drawKeypoints();
	// drawSkeleton();
	// drawBlob();
	giftWrap();
}

function drawBlob() {
	/**
	 * Loop through all poses
	 */
	for (let i = 0; i < poses.length; i++) {
		/**
		 * load each pose into p
		 */
		let p = poses[i].pose;

		let radius = 100;
		noFill();
		stroke(255);
		strokeWeight(1);

		/**
		 * Draw a triangle between nose an shoulders
		 */
		beginShape();
		vertex(p.rightShoulder.x, p.rightShoulder.y);
		vertex(p.nose.x, p.nose.y);
		vertex(p.leftShoulder.x, p.leftShoulder.y);
		endShape(CLOSE);
	}
}

// A function to draw ellipses over the detected keypoints
function giftWrap() {
	// Loop through all the poses detected
	for (let i = 0; i < poses.length; i++) {
		// For each pose detected, loop through all the keypoints
		let pose = poses[i].pose.keypoints;
		pose.sort((a, b) => a.position.x - b.position.x);
		leftMost.x = pose[0].position.x;
		leftMost.y = pose[0].position.y;
		currentVertex = leftMost;
		nextVertex.x = pose[1].position.x
		nextVertex.y = pose[1].position.y
		index = 2;
		stroke(255);
		strokeWeight(8);
		for (let p of pose) {
			// point(p.position.x,p.position.y)
		}
		point(leftMost.x, leftMost.y);
		line(
			currentVertex.x,
			currentVertex.y,
			nextVertex.x,
			nextVertex.y
		);
		let checking = pose[index];
		line(
			currentVertex.x,
			currentVertex.y,
			checking.x,
			checking.y
		);

		const a = p5.Vector.sub(nextVertex, currentVertex);
		const b = p5.Vector.sub(checking, currentVertex);
		const cross = a.cross(b);
		if (cross > 0) {
			console.log(cross.z);
		}
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
