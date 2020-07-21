let song;
let volSlider, rateSlider, panSlider;
let playButton, jumpButton;
let amp;
let fft;

// https://www.openprocessing.org/sketch/559265
// https://www.openprocessing.org/sketch/597386

function setup() {
	// createCanvas(windowWidth, windowHeight / 2);
	createCanvas(360, 360);
	song = loadSound('spk.mp3', songReady);
	volSlider = createSlider(0, 1, 0.1, 0.01);
	rateSlider = createSlider(0.5, 1.5, 1, 0, 0.01);
	panSlider = createSlider(-1, 1, 0, 0.01);
	playButton = createButton('play');
	playButton.mousePressed(togglePlay);
	jumpButton = createButton('jump');
	jumpButton.mousePressed(songJump);
	amp = new p5.Amplitude();
	fft = new p5.FFT(0.99,64);
}

function draw() {
	background(220);
	if (song) {
		song.setVolume(volSlider.value());
		song.rate(rateSlider.value());
		song.pan(panSlider.value());
	}

	translate(width / 2, height / 2);
	
	let x = [];
	let y = [];

	let spectrum = fft.analyze();

	for (let i = 0; i < spectrum.length; i++) {
		const element = spectrum[i];
		spectrum[i] = map(element,0,255,-180,180)
		
	}
	// let x = spectrum.slice(0, spectrum.length / 2);
	// let y = spectrum.slice(spectrum.length / 2, spectrum.length);

	for (let i = 0; i < spectrum.length/2; i++) {
		x.push(spectrum[i])
	}

	for (let i = spectrum.length; i > 0; i--) {
		y.push(spectrum[i])
	}

	for (let i = 0; i < x.length; i++) {
		let nx = x[i];
		for (let j = 0; j < y.length; j++) {
			let ny = y[j];
			point(ny, nx);
		}
	}
	// beginShape();
	// for (let i = 0; i < spectrum.length; i++) {
	// 	let element = spectrum[i];
	// 	let angle = map(i,0,spectrum.length,0,360)
	// 	let r = map(element, 0, 255, 100, 200);
	// 	let x = r * sin(angle);
	// 	let y = r * cos(angle);
	// 	// vertex(x, y);
	// 	line(0,0,x,y)
	// }
	// endShape();
}

function songReady() {
	// song.play();
	song.setVolume(0.1);
}

function togglePlay() {
	if (song.isPlaying()) {
		song.pause();
		playButton.html('play');
	} else {
		song.play();
		playButton.html('pause');
	}
}

function songJump() {
	let curr = song.currentTime();
	song.jump(curr + 15);
}
