let mic, recorder, soundFile, fft;
let song;
let recordingState = 0;
let micLevel;
var context = new AudioContext();
 
let yoff = 0.0;

function setup() {
	createCanvas(windowWidth, windowHeight);

	mic = new p5.AudioIn();
	mic.start();

	recorder = new p5.SoundRecorder();
	recorder.setInput(mic);

	soundFile = new p5.SoundFile();

	fft = new p5.FFT();
	fft.setInput(mic);

	tape();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	micLevel = mic.getLevel()
	let spectrum = fft.analyze();

	background(200);
	noStroke();
	document.querySelector('button').addEventListener('click', function() {
		context.resume().then(() => {
			console.log('Playback resumed successfully');
		});
	});
	
	
	let step = 16;
	
	for (let i = 0; i < spectrum.length; i += step) {
		// Map i (which should be 1024) to 360
		// and use it for the bar's hue
		colorMode(HSB);
		let x = map(i, 0, spectrum.length / 1.8, 0, width);
		let hue = map(i, 0, spectrum.length / 1.8, 0, 340);
		fill(hue, 200, 80, 255);
		
		let level = map(spectrum[i], 0, 255, height, 0);
		let barWidth = width / step / 5;
		rect(x, level, barWidth, height);
	}
	
	noFill();
	beginShape();
	
	let xoff = 0; // Option #1: 2D Noise
	// let xoff = yoff; // Option #2: 1D Noise
	
	// Iterate over horizontal pixels
	for (let x = 0; x <= width; x += 10) {
		// Calculate a y value according to noise, map to
		
		// Option #1: 2D Noise
		let y = map(noise(xoff, yoff), 0, 1, 200, 300);
		
		// Option #2: 1D Noise
		// let y = map(noise(xoff), 0, 1, 200,300);
		
		// Set the vertex
		vertex(x, y);
		// Increment x dimension for noise
		xoff += 0.05;
	}
	// increment y dimension for noise
	yoff += 0.01;
	vertex(width, height);
	vertex(0, height);
	endShape(CLOSE);
 
	push()
	fill(50)
	ellipse(width/2,height/2,micLevel*100000)

	pop()
}

function tape() {
	let recButton = createButton('Rec');
	recButton.position(100,100)
	recButton.mousePressed(function () {
		recorder.record(soundFile);
	});
	let stopButton = createButton('Stop');
	stopButton.position(200,100)
	stopButton.mousePressed(function(){
		recorder.stop();	
	})

	let playButton = createButton('Play');
	playButton.position(300,100)
	playButton.mousePressed(function(){
		soundFile.play()
	})

	let saveButton = createButton('Save');
	saveButton.position(400,100)
	saveButton.mousePressed(function(){
		saveSound(soundFile, 'sound.wav');
	})
}
// function mousePressed() {
// 	if (recordingState === 0 && mic.enabled) {
// 		recorder.record(soundfile);
// 		fill(255, 0, 0);
// 		circle(width / 2, height / 2, 100, 100);
// 		text('recording', 20, 20);
// 		recordingState++;
// 	} else if (recordingState === 1) {
// 		background(100);
// 		recorder.stop();
// 		fill(0, 255, 0);
// 		circle(width / 2, height / 2, 100, 100);
// 		text('stopped', 20, 20);
// 		recordingState++;
// 	} else if (recordingState === 2) {
// 		background(100);
// 		text('saving', 20, 20);
// 		soundFile.play();
// 		saveSound(soundFile, 'sound.wav');

// 		fill(0, 0, 255);
// 		circle(width / 2, height / 2, 100, 100);
// 		recordingState = 0;
// 	}
// }
