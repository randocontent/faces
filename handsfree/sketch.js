let pos = { x: 0, y: 0 };
let open = false;
let closed = false;
let status;
let dir;
let colorAcc = 0; 

window.handsfree = new Handsfree({});

function setup() {
	createCanvas(800, 800);
	handsfree.start();
	stroke('black');
	strokeWeight(3);
	status = select('#status');
	dir = select('#dir');
}

function draw() {
	if (open) {
		// status.html('open');
	}
	if (closed) {
		// status.html('closed');
	}

	let pitch = deg(handsfree.head.rotation[0]);
	let yaw = deg(handsfree.head.rotation[1]);
	let roll = deg(handsfree.head.rotation[2]);

	status.html();
	dir.html(yaw)
}

Handsfree.use('p5.facePaint', {
	x: 0,
	y: 0,
	pX: 0,
	pY: 0,

	onUse() {
		console.log('onUse');
	},

	onFrame({ head }) {
		this.pX = this.x;
		this.pY = this.y;
		this.x = head.pointer.x + 10;
		this.y = head.pointer.y + 10;

		if (head.state.mouthOpen) {
			line(this.x, this.y, this.pX, this.pY);
			// status.html('open')
		}
		if (head.state.mouthClosed) {
			// status.html('closed')
		}

		let yaw = deg((handsfree.head.rotation[1] * 180) / Math.PI);

		if (abs(yaw) > 15) {
			colorAcc = yaw
		} else {
			colorAcc = 0
		}
	},
});

handsfree.on('clear', () => {
	Handsfree.plugins['p5.facePaint'].p5.clear();
});

function deg(r) {
	return floor((r * 180) / Math.PI)
}