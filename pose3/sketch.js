let capture, posePreview;
let webcamButton, imageButton, videoButton;
let poseNet;
let poses = [];

// Only appears to work...
function windowResized(){
	let elWidth = select('#sketch-placeholder').width;
	resizeCanvas(elWidth,elWidth*0.9);
}

function startWebcam() {
	// Start a new video capture and place it in the tree
	capture = createCapture(VIDEO, captureReady);
	capture.size(320, 240);
	select('#webcam-preview-placeholder').html('')
	capture.parent('webcam-preview-placeholder')
}

function captureReady() {
	
	
}

function startImage() {
	capture = loadImage('https://source.unsplash.com/600x400/?group,people',imageReady)
}

function imageReady(){
	capture.resize(600,400)
	console.log(capture)
	let options = {imageScaleFactor: 1,minConfidence: 0.1}
	poseNet = ml5.poseNet(modelReady, options)
	poseNet.on('pose', results => {poses = results})
}

function modelReady() {
	poseNet.multiPose(capture)
	
}

function startVideo() {
	
}


function modelReady() {
	// select('#status').html('Model Loaded');
	console.log('Model ready.')
	console.dir(poses)
}

function setup() {
	
	let elWidth = select('#sketch-placeholder').width;
	var canvas = createCanvas(elWidth,elWidth*0.9);
	canvas.parent('sketch-placeholder');
	
	// Start the poseNet loop and store the results in a global variable 'poses'
	poseNet = ml5.poseNet(capture, modelReady);
	poseNet.on('pose', function(results) {
		poses = results;
	});
	
	// mousePressed can accept a function name (not a function call) as an argument
	// https://p5js.org/reference/#/p5.Element/mousePressed
	
	webcamButton = select('#start-webcam')
	webcamButton.mousePressed(startWebcam)
	
	imageButton = select('#start-image')
	imageButton.mousePressed(startImage)
	
	videoButton = select('#start-video')
	videoButton.mousePressed(startVideo)
	
	// To test the webcam it's easier to have it start on load
	// startWebcam();
	startImage();
	// startVideo();
}

function draw() {
	background(225);

	image(capture,0,0)

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