let webcamButton, imageButton, videoButton;
let poseNet;
let poses = [];
let sample;


function getImage(){
	sample = loadImage('https://source.unsplash.com/600x400/?group,people',newImage)

}
function newImage(){
	console.log('new image')
	poseNet.multiPose(sample)

}
function setup() {

	
	let elWidth = select('#sketch-placeholder').width;
	var canvas = createCanvas(elWidth,elWidth*0.9);
	canvas.parent('sketch-placeholder');
	sample = loadImage('https://source.unsplash.com/600x400/?group,people',imageReady)
	
	
}

function imageReady(){
	console.dir(sample)
	sample.resize(600,400)
	let options = {imageScaleFactor: 1,minConfidence: 0.1}
	if (!poseNet) {
		poseNet = ml5.poseNet(modelReady, options)
	}
	
	poseNet.on('pose', results => {poses = results})
}

function modelReady() {
	select('#status').html('Model Loaded');
	poseNet.multiPose(sample)
}

function draw() {
	background(225);

	// console.dir(img)
	image(sample,0,0)

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
        ellipse(keypoint.position.x, keypoint.position.y, 5, 5);
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