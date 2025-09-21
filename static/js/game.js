let canvas, context, request_id, xhttp;
// for fps throttle
let fpsInterval = 1000 / 30,
	now,
	then = Date.now();
// player
let player = {
	hp: 100,
	x: 0,
	y: 0,
	width: 16,
	height: 16,
	frameX: 0,
	frameY: 0,
	speed: 1,
	xChange: 0,
	yChange: 0,
	score: 0,
};
// enemies + bombs
let enemies = [],
	bombs = [];
// crab spawn points
let spawnPoints = [
	{ x: 0, y: 280, height: 80, width: 48 },
	{ x: 912, y: 280, height: 80, width: 48 },
	{ x: 455, y: 592, height: 48, width: 64 },
];
// white, outer boundaries
let boundaries = [
	{ x: 0, y: 0, height: 48, width: 48 },
	{ x: 912, y: 0, height: 48, width: 48 },
	{ x: 0, y: 592, height: 48, width: 48 },
	{ x: 912, y: 592, height: 48, width: 48 },
	{ x: 0, y: 48, height: 544, width: 32 },
	{ x: 928, y: 48, height: 544, width: 32 },
	{ x: 48, y: 0, height: 32, width: 864 },
	{ x: 48, y: 608, height: 32, width: 864 },
];
// yellow, solid shapes that the player cannot go through
let obstacles = [
	{ x: 160, y: 64, height: 48, width: 48 },
	{ x: 96, y: 352, height: 48, width: 48 },
	{ x: 528, y: 464, height: 48, width: 48 },
	{ x: 640, y: 80, height: 48, width: 48 },
	{ x: 128, y: 192, height: 64, width: 112 },
	{ x: 240, y: 432, height: 96, width: 64 },
	{ x: 368, y: 304, height: 80, width: 64 },
	{ x: 704, y: 336, height: 48, width: 48 },
	{ x: 800, y: 128, height: 64, width: 64 },
];
// red, player will die and game will end if player collides
let hazards = [
	{ x: 32, y: 32, height: 64, width: 48 },
	{ x: 336, y: 32, height: 68, width: 48 },
	{ x: 336, y: 138, height: 22, width: 48 },
	{ x: 112, y: 512, height: 96, width: 16 },
	{ x: 688, y: 528, height: 80, width: 112 },
	{ x: 496, y: 160, height: 64, width: 82 },
	{ x: 352, y: 576, height: 32, width: 80 },
];
// bridge safety railings
let railings = [
	{ x: 336, y: 100, height: 5, width: 48 },
	{ x: 336, y: 134, height: 5, width: 48 },
];
// bg layer 0
let layer0 = [
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 102, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 102, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 51, 0, 0, 0, 0,
		0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 102, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 102, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 2, 0, 101, 102, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 52, 102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0,
	],
	[
		0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		3, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 51, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 54, 0, 0, 0, 0, 1, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 50, 102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 1, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
];
// bg layer 1
let layer1 = [
	[
		653, 654, 655, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637,
		637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637,
		637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 653, 654, 655,
	],
	[
		702, 703, 704, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637,
		637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637,
		637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 702, 703, 704,
	],
	[
		751, 752, 753, 253, 253, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 253, 253, 0, 0, 57, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 751, 752, 753,
	],
	[
		637, 637, 253, 253, 253, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 253, 253, 0, 0, 57, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 253, 253, 253, 0, 0, 0, 0, 0, 121, 121, 121, 0, 0, 0, 0, 0, 0, 0, 0, 253, 253, 253, 0, 0, 57, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 253, 253, 253, 0, 0, 0, 0, 0, 121, 170, 121, 0, 0, 0, 0, 0, 0, 0, 0, 253, 253, 253, 0, 0, 57, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 121, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 121, 121, 121, 0, 0, 0, 0, 0, 0, 0, 0, 253, 253, 253, 0, 0, 57, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 121, 170, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 58, 261, 261, 261, 261, 260, 261, 262, 60, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 121, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 57, 0, 343, 253, 253, 253, 0, 0, 57, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 121, 121, 121, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 253, 253, 253, 0, 0, 57, 0, 0, 0, 0, 0, 0,
		0, 650, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 170, 170, 121, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 253, 253,
		253, 253, 253, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 170, 170, 121, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 253, 253,
		253, 253, 253, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 121, 121, 121, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 121, 121, 121, 121, 121, 121, 121, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0,
		253, 253, 253, 253, 253, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 121, 170, 170, 170, 170, 170, 121, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0,
		253, 253, 253, 253, 253, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 121, 170, 170, 170, 170, 170, 121, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 121, 121, 121, 121, 121, 121, 121, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		18, 19, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 19, 20,
	],
	[
		67, 68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 68, 69,
	],
	[
		67, 68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 121, 121, 121, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 68, 69,
	],
	[
		67, 68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 170, 170, 121, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 68, 69,
	],
	[
		67, 68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 170, 170, 121, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 121, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 68, 69,
	],
	[
		116, 117, 118, 0, 0, 0, 121, 121, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 170, 170, 121, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 170, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 116, 117, 118,
	],
	[
		637, 637, 0, 0, 0, 0, 121, 170, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 121, 121, 121, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 121, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 121, 121, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 121, 121, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 170, 170, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 170, 170, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		121, 121, 121, 0, 0, 0, 0, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 170, 170, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		121, 170, 121, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 170, 170, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		121, 121, 121, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 253, 0, 0, 0, 0, 0, 0, 0, 121, 121, 121, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 253, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 57, 0, 0, 253, 253, 253, 253, 253, 253, 253, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 253, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 57, 0, 0, 253, 253, 253, 253, 253, 253, 253, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 253, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 57, 0, 0, 253, 253, 253, 253, 253, 253, 253, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		637, 637, 0, 0, 0, 0, 0, 253, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 253, 253, 253, 253, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 253, 253, 253, 253, 253, 253, 253, 0, 0, 0, 0, 0, 0, 0, 0, 637, 637,
	],
	[
		653, 654, 655, 596, 597, 598, 599, 253, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 253, 253, 253, 253, 0,
		18, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 57, 596, 597, 253, 253, 253, 253, 253, 253, 253, 0, 0, 0, 0, 0, 0, 0, 653,
		654, 655,
	],
	[
		702, 703, 704, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637,
		637, 637, 637, 637, 637, 637, 67, 68, 68, 68, 69, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637,
		637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 702, 703, 704,
	],
	[
		751, 752, 753, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637,
		637, 637, 637, 637, 637, 637, 116, 117, 117, 117, 118, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637,
		637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 637, 751, 752, 753,
	],
];
// tiles per row in tileset, tile size in tileset
let tilesPerRow = 49,
	tileSize = 16;
// images
let IMAGES = {
	layer0: "static/images/tilesets/colored_packed.png",
	layer1: "static/images/tilesets/colored-transparent_packed.png",
	player: "static/images/player/player.png",
	enemy: "static/images/enemies/crab.png",
	bomb: "static/images/items/bomb.png",
};
// player not moving unless key pressed
let moveLeft = false,
	moveRight = false,
	moveUp = false,
	moveDown = false;
// misc checks
let muted = false,
	gameStart = false,
	gameOver = false,
	won = false;
// bg music + sound effects
let bgMusic = new Audio("static/sounds/bg-music.wav"),
	crabSound = new Audio("static/sounds/crab-break.wav"),
	bombSound = new Audio("static/sounds/8-bit-explosion.wav"),
	deathSound = new Audio("static/sounds/player-death.mp3"),
	winSound = new Audio("static/sounds/win.wav");
let sounds = [bgMusic, crabSound, bombSound, deathSound, winSound];
// spawn points
let spawnPoint, spawnX, spawnY, lastSpawn;

document.addEventListener("DOMContentLoaded", level1, false);

function level1() {
	canvas = document.querySelector("canvas");
	context = canvas.getContext("2d");

	let toggleBtn = document.querySelector("#toggle-mute");
	toggleBtn.addEventListener("click", toggleMute, false);

	if (gameStart) {
		bgMusic.play();

		player.x = canvas.width / 2 - player.width / 2;
		player.y = canvas.height / 2 - player.height / 2;

		window.addEventListener("keydown", movePlayer, false);
		window.addEventListener("keyup", stopPlayer, false);

		loadImages(draw);
	} else {
		canvas.addEventListener("click", startGame, false);

		context.fillStyle = "white";
		context.textAlign = "center";
		context.font = "bold 60px Source Sans Pro Medium";
		context.fillText("CLICK ANYWHERE", canvas.width / 2, canvas.height / 2 - 65);
		context.fillText("IN THE CANVAS", canvas.width / 2, canvas.height / 2);
		context.fillText("TO START", canvas.width / 2, canvas.height / 2 + 65);
		context.strokeStyle = "black";
		context.strokeText("CLICK ANYWHERE", canvas.width / 2, canvas.height / 2 - 65);
		context.strokeText("IN THE CANVAS", canvas.width / 2, canvas.height / 2);
		context.strokeText("TO START", canvas.width / 2, canvas.height / 2 + 65);
	}
}

function draw() {
	request_id = window.requestAnimationFrame(draw);
	// fps calculation
	now = Date.now();
	let elapsed = now - then;
	if (elapsed <= fpsInterval) {
		return;
	}
	then = now - (elapsed % fpsInterval);
	// clear canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	// draw layer0 from tileset
	drawLayer(40, 60, layer0, IMAGES.layer0);
	// draw layer1 from tileset
	drawLayer(40, 60, layer1, IMAGES.layer1);
	// draw spawn boxes, transparency 0
	context.fillStyle = "#00ff0000";
	for (let s of spawnPoints) {
		context.fillRect(s.x, s.y, s.width, s.height);
	}
	// draw boundaries, transparency 0
	context.fillStyle = "#ffffff00";
	for (let b of boundaries) {
		context.fillRect(b.x, b.y, b.width, b.height);
	}
	// draw obstacles, transparency 0
	context.fillStyle = "#ffff0000";
	for (let o of obstacles) {
		context.fillRect(o.x, o.y, o.width, o.height);
	}
	// draw railings, transparency 0
	context.fillStyle = "#ffa50000";
	for (let r of railings) {
		context.fillRect(r.x, r.y, r.width, r.height);
	}
	// draw hazards, transparency 0
	context.fillStyle = "#ff000000";
	for (let h of hazards) {
		context.fillRect(h.x, h.y, h.width, h.height);
	}
	if (player.score >= 50) {
		won = true;
		endGame("Winner!");
		return;
	}
	// draw player
	context.drawImage(
		IMAGES.player,
		player.frameX * player.width,
		player.frameY * player.height,
		player.width,
		player.height,
		player.x,
		player.y,
		player.width,
		player.height
	);
	// populate enemies array
	while (enemies.length < 6) {
		spawnPoint = randChoice(spawnPoints);
		while (spawnPoint === lastSpawn) {
			spawnPoint = randChoice(spawnPoints);
		}
		spawnX = randint(spawnPoint.x + player.width, spawnPoint.x + spawnPoint.width - player.width);
		spawnY = randint(spawnPoint.y, spawnPoint.y + spawnPoint.height - player.height);
		lastSpawn = spawnPoint;
		let enemy = {
			x: spawnX,
			y: spawnY,
			width: 16,
			height: 16,
			frameX: 0,
			frameY: 0,
			speed: 0.4,
			xChange: 0,
			yChange: 0,
		};
		enemies.push(enemy);
	}
	// populate bomb array
	if (randint(0, 100) === 1) {
		while (bombs.length < 1) {
			let bomb = {
				x: randint(50, canvas.width - 50),
				y: randint(50, canvas.height - 50),
				width: 16,
				height: 16,
			};
			bombs.push(bomb);
			spawnCollisions();
		}
	}
	// draw enemies
	for (let e of enemies) {
		context.drawImage(
			IMAGES.enemy,
			e.frameX * e.width,
			e.frameY * e.height,
			e.width,
			e.height,
			e.x,
			e.y,
			e.width,
			e.height
		);
		e.frameX = (e.frameX + 1) % 4;
	}
	// draw bombs
	if (bombs.length > 0) {
		for (let b of bombs) {
			context.drawImage(IMAGES.bomb, b.x, b.y, b.width, b.height);
		}
	}
	// call non spawning related collisions
	nonSpawnCollisions();
	// player movement & sprite changes
	playerDirection();
	// enemy movement
	for (let e of enemies) {
		moveEnemyToPlayer(player, e);
	}
	// update player
	player.x += player.xChange;
	player.y += player.yChange;
	// friction
	player.xChange = player.xChange * 0.8;
	player.yChange = player.yChange * 0.8;
	// update enemy
	for (let e of enemies) {
		e.x += e.xChange;
		e.y += e.yChange;
		e.xChange = e.xChange * 0.8;
		e.yChange = e.yChange * 0.8;
	}
	// score text
	context.fillStyle = "black";
	context.strokeStyle = "green";
	context.fillRect(canvas.width / 2 - 25, 0, 50, 32);
	context.strokeRect(canvas.width / 2 - 25, 0, 50, 32);
	context.fillStyle = "white";
	context.textAlign = "center";
	context.font = "30px Source Sans Pro Medium";
	context.fillText(player.score, canvas.width / 2, 26);
}
// start game
function startGame(event) {
	gameStart = true;
	canvas.removeEventListener("click", startGame, false);
	level1();
}
// toggle audio
function toggleMute(event) {
	let toggleBtn = document.querySelector("#toggle-mute");
	if (muted === false) {
		for (let s of sounds) {
			s.muted = true;
		}
		muted = true;
		toggleBtn.style.backgroundColor = "red";
	} else {
		for (let s of sounds) {
			s.muted = false;
		}
		muted = false;
		toggleBtn.style.backgroundColor = "green";
	}
}
// draw layer(s)
function drawLayer(rowTotal, colTotal, layerMatrix, layerImage) {
	for (let r = 0; r < rowTotal; r += 1) {
		for (let c = 0; c < colTotal; c += 1) {
			let tile = layerMatrix[r][c];
			if (tile >= 0) {
				let tileRow = Math.floor(tile / tilesPerRow);
				let tileCol = Math.floor(tile % tilesPerRow);
				context.drawImage(
					layerImage,
					tileCol * tileSize,
					tileRow * tileSize,
					tileSize,
					tileSize,
					c * tileSize,
					r * tileSize,
					tileSize,
					tileSize
				);
			}
		}
	}
}
// start move player
function movePlayer(event) {
	let key = event.key;
	let altKey = event.keyCode;
	if (key === "ArrowLeft" || altKey === 65) {
		moveLeft = true;
	} else if (key === "ArrowRight" || altKey === 68) {
		moveRight = true;
	} else if (key === "ArrowUp" || altKey === 87) {
		moveUp = true;
	} else if (key === "ArrowDown" || altKey === 83) {
		moveDown = true;
	}
}
// stop player movement
function stopPlayer(event) {
	let key = event.key;
	let altKey = event.keyCode;
	if (key === "ArrowLeft" || altKey === 65) {
		moveLeft = false;
	} else if (key === "ArrowRight" || altKey === 68) {
		moveRight = false;
	} else if (key === "ArrowUp" || altKey === 87) {
		moveUp = false;
	} else if (key === "ArrowDown" || altKey === 83) {
		moveDown = false;
	}
}
// player direction and sprite changes
function playerDirection() {
	let frameX = (player.frameX + 1) % 3;
	if (moveLeft) {
		player.xChange -= player.speed;
		player.frameY = 1;
		player.frameX = frameX;
	}
	if (moveRight) {
		player.xChange += player.speed;
		player.frameY = 2;
		player.frameX = frameX;
	}
	if (moveUp) {
		player.yChange -= player.speed;
		player.frameY = 3;
		player.frameX = frameX;
	}
	if (moveDown) {
		player.yChange += player.speed;
		player.frameY = 0;
		player.frameX = frameX;
	}
}
// create path from enemy to player (pythagoras theorem)
function moveEnemyToPlayer(player, e) {
	// calc vector between player and e
	let toPlayerX = player.x - e.x;
	let toPlayerY = player.y - e.y;
	// calc hypotenuse, x = square root((dist between player.x and e.x)squared + (dist between player.y and e.y)squared)
	let toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
	// normalize path to player
	toPlayerX = toPlayerX / toPlayerLength;
	toPlayerY = toPlayerY / toPlayerLength;
	// move enemy towards player
	e.xChange += toPlayerX * e.speed;
	e.yChange += toPlayerY * e.speed;
}
// collision check
function collisionCheck(object1, object2) {
	if (
		object1.x < object2.x + object2.width &&
		object1.x + object1.width > object2.x &&
		object1.y < object2.y + object2.height &&
		object1.height + object1.y > object2.y
	) {
		// collision
		return true;
	} else {
		// no collision
		return false;
	}
}
// enlarged hit-box for better spawns
function spawnBuffer(object1, object2) {
	// spawn buffer spacing
	let buffer = 30;
	if (
		object1.x - buffer < object2.x + object2.width &&
		object1.x + object1.width + buffer > object2.x &&
		object1.y - buffer < object2.y + object2.height &&
		object1.height + object1.y + buffer > object2.y
	) {
		// collision
		return true;
	} else {
		// no collision
		return false;
	}
}
// get new position if collision
function newPosition(object1, object2) {
	for (let i of object1) {
		for (let j of object2) {
			while (spawnBuffer(j, i)) {
				i.x = randint(50, canvas.width - 50);
				i.y = randint(50, canvas.height - 50);
				if (!spawnBuffer(j, i)) break;
			}
		}
	}
}
// spawn collisions
function spawnCollisions() {
	/* 
	// enemies
	for (let e of enemies) {
		while (spawnBuffer(player, e)) {
			e.x = randint(50, canvas.width - 50);
			e.y = randint(50, canvas.height - 50);
			if (!spawnBuffer(player, e)) break;
		}
	}
	newPosition(enemies, obstacles);
	newPosition(enemies, bombs);
	*/
	// bombs
	for (let b of bombs) {
		while (spawnBuffer(player, b)) {
			b.x = randint(50, canvas.width - 50);
			b.y = randint(50, canvas.height - 50);
			if (!spawnBuffer(player, b)) break;
		}
	}
	newPosition(bombs, enemies);
	newPosition(bombs, obstacles);
	newPosition(bombs, hazards);
}
// player check single collisions
function playerCollisionCheck(object1, object2) {
	for (let i of object1) {
		if (collisionCheck(i, object2)) {
			if (object1 === hazards) {
				endGame("You have drowned!");
				return;
			} else {
				// just player.x -= player.xChange; wasn't a strong enough anti-force (think its because of the fps) so just multiplied it
				player.x -= player.xChange * 1.5;
				player.y -= player.yChange * 1.5;
				player.xChange = 0;
				player.yChange = 0;
			}
		}
	}
}
// enemies check for collisions for score
function newPositionPlusScore(object1, object2) {
	for (let i of object1) {
		for (let j of object2) {
			if (collisionCheck(j, i)) {
				if (object1 === enemies && object2 === obstacles) {
					crabSound.loop = false;
					crabSound.play();
				}
				spawnPoint = randChoice(spawnPoints);
				spawnX = randint(spawnPoint.x + player.width, spawnPoint.x + spawnPoint.width - player.width);
				spawnY = randint(spawnPoint.y, spawnPoint.y + spawnPoint.height - player.height);
				i.x = spawnX;
				i.y = spawnY;
				player.score++;
			} else if (object1 === enemies && object2 === boundaries) {
				return;
			}
		}
	}
}
// non spawn collisions
function nonSpawnCollisions() {
	// player collisions for enemies
	for (let e of enemies) {
		if (collisionCheck(player, e)) {
			endGame("You have died!");
			return;
		}
	}
	// collision check for boundaries
	playerCollisionCheck(boundaries, player);
	// collision check for obstacles
	playerCollisionCheck(obstacles, player);
	// railing check
	playerCollisionCheck(railings, player);
	// collision check for hazards
	playerCollisionCheck(hazards, player);
	// non player collisions for enemies, score
	newPositionPlusScore(enemies, obstacles);
	newPositionPlusScore(enemies, boundaries);
	// get rid of current enemies on screen and increment score
	for (let b of bombs) {
		if (collisionCheck(b, player)) {
			bombSound.loop = false;
			bombSound.play();
			player.score += enemies.length;
			enemies = [];
			let index = bombs.indexOf(b);
			bombs.splice(index, 1);
		}
	}
}
// game over
function endGame(message) {
	window.removeEventListener("keydown", movePlayer, false);
	window.removeEventListener("keyup", stopPlayer, false);
	window.cancelAnimationFrame(request_id);
	
	gameOver = true;
	bgMusic.muted = true;

	context.fillStyle = "#00000075";
	context.fillRect(
		canvas.width / 2 - canvas.width / 2 / 2,
		canvas.height / 2 - 70,
		canvas.width / 2,
		canvas.height / 4
	);
	context.strokeStyle = "white";
	context.strokeRect(
		canvas.width / 2 - canvas.width / 2 / 2,
		canvas.height / 2 - 70,
		canvas.width / 2,
		canvas.height / 4
	);

	context.fillStyle = "white";
	context.textAlign = "center";
	context.font = "bold 50px Source Sans Pro Medium";
	context.fillText(message, canvas.width / 2, canvas.height / 2);
	context.fillText("Score: " + player.score, canvas.width / 2, canvas.height / 2 + 50);
	context.strokeStyle = "black";
	context.strokeText(message, canvas.width / 2, canvas.height / 2);
	context.strokeText("Score: " + player.score, canvas.width / 2, canvas.height / 2 + 50);

	// set bg to red if dead ,green if won
	let bgElement = document.querySelector("html");
	if (!won) {
		deathSound.loop = false;
		deathSound.play();
		bgElement.style.backgroundColor = "red";
	} else {
		winSound.loop = false;
		winSound.play();
		bgElement.style.backgroundColor = "green";
	}
	// create save score button
	let sectionSave = document.querySelector("#save-score");
	let btnSave = document.createElement("button");
	sectionSave.appendChild(btnSave);
	let aSave = document.createElement("a");
	aSave.href = "save_score";
	let bSave = document.createElement("b");
	bSave.innerHTML = "SAVE SCORE";
	aSave.append(bSave);
	btnSave.appendChild(aSave);

	// send score to server
	let data = new FormData();
	data.append("score", player.score);

	xhttp = new XMLHttpRequest();
	xhttp.addEventListener("readystatechange", handleScore, false);
	xhttp.open("POST", "/save_score", true);
	xhttp.send(data);
}
// handle xhttp request
function handleScore() {
	// Check that the response has fully arrived
	if (xhttp.readyState === 4) {
		// Check the request was successful
		if (xhttp.status === 200) {
			// do whatever you want to do with
			// xhttp.responseText or xhttp.responseXML
			if (xhttp.responseText === "success") {
				console.log("Score Sent");
			} else {
				console.log("Score Not Sent");
			}
		}
	}
}
// handle loading of images form IMAGES
function loadImages(callback) {
	let num_images = Object.keys(IMAGES).length;
	let loaded = function () {
		num_images = num_images - 1;
		if (num_images === 0) {
			callback();
		}
	};
	for (let name of Object.keys(IMAGES)) {
		let img = new Image();
		img.addEventListener("load", loaded, false);
		img.src = IMAGES[name];
		IMAGES[name] = img;
	}
}
// rand int
function randint(min, max) {
	return Math.round(Math.random() * (max - min)) + min;
}
// random choice
function randChoice(choices) {
	var index = Math.floor(Math.random() * choices.length);
	return choices[index];
}
