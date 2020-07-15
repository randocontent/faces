let img, capture, startButton, posePreview;
let poseNet;
let poses = [];


function startWebcam() {
	capture = createCapture(VIDEO);
	capture.size(320, 240);
	select('#webcam-preview-placeholder').html('')
	capture.parent('webcam-preview-placeholder')
	// capture.hide();
}

function setup() {
	
	let elWidth = select('#sketch-placeholder').width;
	var canvas = createCanvas(elWidth,elWidth*0.9);
	canvas.parent('sketch-placeholder');
	startWebcam();

	// mousePressed can accept a function name (not a function call) as an argument
	// https://p5js.org/reference/#/p5.Element/mousePressed

	startButton = select('#redo')
	startButton.mousePressed(startWebcam)
	
	poseNet = ml5.poseNet(capture, modelReady);
	poseNet.on('pose', function(results) {
    poses = results;
	});
	
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
	background(225);
	if (capture) {
		// image(capture, 100, 100, 320, 240);
		
	}
	// filter(POSTERIZE, 2);
	drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
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
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}