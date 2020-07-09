let mobilenet;
let video;
let label = '';

function modelReady() {
	console.log('model is ready')
	mobilenet.classify(gotResults)
}

function gotResults(error, results) {
	if (error) {
		console.error(error)
	} else {
		
		label = results[0].label;
		
		// console.table(results)
		mobilenet.classify(gotResults)
	}

}


function setup() {
	createCanvas(640,540);
	background(0); 
	// ship = createImg('../images/anders.jpg', imageReady)
	video = createCapture(VIDEO)
	video.hide();
	mobilenet =  ml5.imageClassifier('MobileNet', video, modelReady)

}

function draw() {
	// show the video inside the canvas
	// let confidence = results[0].confidence;
	background(0);
	fill(255);
	textSize(34);
	text(label, 10, height - 20)
	
	textSize(24);
	// text(confidence, 10, height - 20)
	
	image(video, 0, 0)
}