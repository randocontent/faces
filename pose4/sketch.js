let webcamButton, imageButton, videoButton;
let poseNet;
let poses = [];
let sample;
let status;

// https://source.unsplash.com/
const sampleImageSource = 'https://source.unsplash.com/600x400/?group,people';

// curl -H "Authorization: YOUR_API_KEY" \
//  "https://api.pexels.com/videos/search?query=nature&per_page=1"
const sampleVideoSource =
	'https://api.pexels.com/videos/search?query=dance&per_page=25';
const pexelsApiKey = '563492ad6f91700001000001a03bbcffe1274ec3b613ef62e8fc0120';

/*

************************************************************

*/

/**
 * Loads a new image and then calls imageReady()
 */
function getNewImage() {
	status.html('in getNewImage()');
	// Todo: disable buttons until we're ready to try again
	sample = createImg(
		'https://source.unsplash.com/600x400/?group,people',
		'',
		'', // no CORS
		imageReady
	);
	sample.hide()
}

/**
 * Handle the new image
 */
function imageReady() {
	status.html('in imageReady()');
	console.log('sample from imageReady(): ', sample)

	// run poseNet on the image
	poseNet.multiPose(sample);
	poseNet.on('pose', function (results) {
		poses = results;
});

	// show the source image in the sidebar
	select('#webcam-preview-placeholder').child(sample)
	sample.show()
}

/**
 * Starts the webcam and calls webcamReady() ?
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

	sample.size(320, 240);
	select('#webcam-preview-placeholder').html('');
	sample.parent('webcam-preview-placeholder');
}

/**
 * Load a new video, uses findSDVideo() to find the smallest file, and calls videoReady() and calls
 */
function getNewVideo() {
	status.html('in getNewVideo()');

	// Todo: disable buttons until we're ready to try again
	let newVideo = fetch(sampleVideoSource, {
		headers: {
			Authorization: pexelsApiKey,
		},
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('http error: ' + response.status);
			} else {
				return response.json();
			}
		})
		.then(result => {
			let offset = Math.floor(Math.random() * 25);
			console.log('before calling findSDVideo: ')
			console.table(result.videos[offset].video_files)
			let newVideo = findSDVideo(result.videos[offset].video_files);
			console.log('newVideo after findSDVideo: ');
			console.table(newVideo)
			sample = createVideo(newVideo.link, videoReady);
			sample.loop();
			// sample.hide()
			select('#webcam-preview-placeholder').html('');
			sample.parent('webcam-preview-placeholder');
		})
		.catch(e => {
			console.log('fetch error: ' + e.message);
		});
}

/**
 * Return video with width < 640
 */
function findSDVideo(videos) {
	status.html('in findSDVideo()');

	let width = 740;
	let small;
	videos.forEach(video => {
		if (video.width && video.width < width) {
			small = video;
			width = video.width;
		}
	});
	return small;
}

/**
 * Handle the new video
 */
function videoReady() {
	status.html('in videoReady()');

	sample = document.querySelector('video');
	sample.width = width;
	console.log('video: ')
	console.dir(sample)
	poseNet = ml5.poseNet(sample, modelReady);
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

	poseNet = ml5.poseNet(modelReady);

	status = select('#status')

	// Preprare controls

	// select() takes a simple css selector-like syntax
	// '#' for id '.' for class and no prefix for tag
	// https://p5js.org/reference/#/p5/select

	webcamButton = select('#webcam-button');
	imageButton = select('#image-button');
	videoButton = select('#video-button');

	// mousePressed() takes a function name (not a function call)
	// no quotes since it's not a string
	// https://p5js.org/reference/#/p5.Element/mousePressed

	webcamButton.mousePressed(getNewWebcam);
	imageButton.mousePressed(getNewImage);
	videoButton.mousePressed(getNewVideo);

	// Get a sample on load
	// sample = loadImage(sampleImageSource, imageReady);
	// getNewVideo();
}

function draw() {
	background(225);

	// console.dir(img)
	// image(sample, 0, 0);

	drawKeypoints();
	drawSkeleton();
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
				ellipse(keypoint.position.x, keypoint.position.y+100, 9, 9);
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
			strokeWeight(4)
			line(
				partA.position.x,
				partA.position.y+100,
				partB.position.x,
				partB.position.y+100
			);
		}
	}
}
