// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

// PoseNet with a pre-recorded video, modified from:
// https://github.com/ml5js/ml5-examples/blob/master/p5js/PoseNet/sketch.js
// https://gist.github.com/golanlevin/701cec4696b61715879ccdb64855c155

let poseNet;
let poses = [];

let video;
var videoIsPlaying; 

// https://p5js.org/examples/simulate-soft-body.html
let centerX = 0.0, centerY = 0.0;

let radius = 45, rotAngle = -90;
let accelX = 0.0, accelY = 0.0;
let deltaX = 0.0, deltaY = 0.0;
let springing = 0.0009, damping = 0.98;

//corner nodes
let nodes = 5;

//zero fill arrays
let nodeStartX = [];
let nodeStartY = [];
let nodeX = [];
let nodeY = [];
let angle = [];
let frequency = [];

// soft-body dynamics
let organicConstant = 1.0;




function setup() {
  videoIsPlaying = false; 
  createCanvas(1080, 2048);
  video = createVideo('video-tall2.mp4', vidLoad);
  // video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
	});
	  //center shape in window
		centerX = width / 2;
		centerY = height / 2;
	
  // Hide the video element, and just show the canvas
	video.hide();
	  //initialize arrays to 0
		for (let i = 0; i < nodes; i++){
			nodeStartX[i] = 0;
			nodeStartY[i] = 0;
			nodeY[i] = 0;
			nodeY[i] = 0;
			angle[i] = 0;
		}
	
		// iniitalize frequencies for corner nodes
		for (let i = 0; i < nodes; i++){
			frequency[i] = random(5, 12);
		}
frameRate(30)	
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function mousePressed(){
  vidLoad();
}

function draw() {
	background(200,50)
	// image(video, 0, 0);

  // We can call both functions to draw all keypoints and the skeletons
  // drawKeypoints();
	// drawSkeleton();
	
	drawShape();
  moveShape();
}

function drawShape() {
  //  calculate node  starting locations
  for (let i = 0; i < nodes; i++){
    nodeStartX[i] = centerX + cos(radians(rotAngle)) * radius;
    nodeStartY[i] = centerY + sin(radians(rotAngle)) * radius;
    rotAngle += 360.0 / nodes;
  }

  // draw polygon
  curveTightness(organicConstant);
  fill(255);
  beginShape();
  for (let i = 0; i < nodes; i++){
    curveVertex(nodeX[i], nodeY[i]);
  }
  for (let i = 0; i < nodes-1; i++){
    curveVertex(nodeX[i], nodeY[i]);
  }
  endShape(CLOSE);
}

function moveShape() {
  //move center point
  deltaX = mouseX - centerX;
  deltaY = mouseY - centerY;

  // create springing effect
  deltaX *= springing;
  deltaY *= springing;
  accelX += deltaX;
  accelY += deltaY;

  // move predator's center
  centerX += accelX;
  centerY += accelY;

  // slow down springing
  accelX *= damping;
  accelY *= damping;

  // change curve tightness
  organicConstant = 1 - ((abs(accelX) + abs(accelY)) * 0.1);

  //move nodes
  for (let i = 0; i < nodes; i++){
    nodeX[i] = nodeStartX[i] + sin(radians(angle[i])) * (accelX * 2);
    nodeY[i] = nodeStartY[i] + sin(radians(angle[i])) * (accelY * 2);
    angle[i] += frequency[i];
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
		let pose = poses[i].pose;
		// console.dir(pose)
		ellipse(pose.leftEye.x, pose.leftEye.y, 40, 20);
		ellipse(pose.rightEye.x, pose.rightEye.y, 40, 20);

		ellipse(pose.leftKnee.x, pose.leftKnee.y, 50, 50);
		ellipse(pose.rightKnee.x, pose.rightKnee.y, 50, 50);

		// star(pose.leftKnee.x, pose.leftKnee.y, 5, 70, 3);
		// star(pose.rightKnee.x, pose.rightKnee.y, 5, 70, 3);

    // for (let j = 0; j < pose.keypoints.length; j++) {
    //   // A keypoint is an object describing a body part (like rightArm or leftShoulder)
		// 	let keypoint = pose.keypoints[j];
    //   // Only draw an ellipse is the pose probability is bigger than 0.2
    //   if (keypoint.score > 0.1) {
    //   	noStroke();
    //     fill(255, 0, 0);
		// 		ellipse(keypoint.position.x, keypoint.position.y, 100, 100);
		
    //   }
		// }

  }
}
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1 + random(25)
    sy = y + sin(a + halfAngle) * radius1 + random(25);
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
// // A function to draw the skeletons
// function drawSkeleton() {
//   // Loop through all the skeletons detected
//   for (let i = 0; i < poses.length; i++) {
//     let skeleton = poses[i].skeleton;
//     // For every skeleton, loop through all body connections
//     for (let j = 0; j < skeleton.length; j++) {
//       let partA = skeleton[j][0];
//       let partB = skeleton[j][1];
//       stroke(255, 0, 0);
//       line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
//     }
//   }
// }


// This function is called when the video loads
function vidLoad() {
  video.stop();
  video.loop();
  videoIsPlaying = true;
}

function keyPressed(){
  if (videoIsPlaying) {
    video.pause();
    videoIsPlaying = false;
  } else {
    video.loop();
    videoIsPlaying = true;
  }
}