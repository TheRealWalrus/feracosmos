//steering bug

var snakeSegments = [];
var snakeHead = [];
var fruit = [];

var cellSize = 15;
var bodyLength = 3;
var spawnX = 9;
var spawnY = 16;

function setup() {
	createCanvas(300, 480);
	frameRate(10);
	snakeHead.push(new SnakeHead(spawnX, spawnY));
	fruit.push(new Fruit(floor(random(0, 20)), floor(random(0, 32))));
}

function draw() {
	background(0);

	fruit[0].display();
	snakeHead[0].update();
	snakeHead[0].display();
	for (var i = 0; i < snakeSegments.length; i++) {
		snakeSegments[i].display()
	}
	if (snakeSegments.length >= bodyLength) {
		snakeSegments.splice(0, 1);
	}
	if (snakeHead[0].x === fruit[0].x && snakeHead[0].y === fruit[0].y) {
		bodyLength++
		fruit[0].x = floor(random(0, 20));
		fruit[0].y = floor(random(0, 32));
	}
	checkRestart()
	//console.log(snakeHead[0].x)
}

function checkRestart() {
	if (snakeHead[0].x < 0 || snakeHead[0].x > 19 || snakeHead[0].y < 0 || snakeHead[0].y > 31) {
		restart();
	}
	for (var i = 0; i < snakeSegments.length; i++) {
		if (snakeHead[0].x === snakeSegments[i].x && snakeHead[0].y === snakeSegments[i].y) {
			restart();
		}
	}
}

function restart() {
	snakeSegments.splice(0, snakeSegments.length);
	snakeHead.splice(0, snakeHead.length);
	snakeHead.push(new SnakeHead(spawnX, spawnY));
	bodyLength = 3;
	fruit[0].x = floor(random(0, 20));
	fruit[0].y = floor(random(0, 32));
}

function keyPressed() {
	if (keyCode == UP_ARROW && snakeHead[0].xSpeed !== 0) {
		snakeHead[0].xSpeed = 0;
		snakeHead[0].ySpeed = -1;
	} else if (keyCode == DOWN_ARROW && snakeHead[0].xSpeed !== 0) {
		snakeHead[0].xSpeed = 0;
		snakeHead[0].ySpeed = 1;
	} else if (keyCode == LEFT_ARROW && snakeHead[0].ySpeed !== 0) {
		snakeHead[0].xSpeed = -1;
		snakeHead[0].ySpeed = 0;
	} else if (keyCode == RIGHT_ARROW && snakeHead[0].ySpeed !== 0) {
		snakeHead[0].xSpeed = 1;
		snakeHead[0].ySpeed = 0;
	}
}

function Fruit(x, y) {
	this.x = x;
	this.y = y;
	this.display = function() {
		noStroke();
		fill(255, 0, 0);
		rect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
	}
}

function SnakeHead(x, y) {
	this.x = x;
	this.y = y;
	this.lastX = 9;
	this.lastY = 15;
	this.xSpeed = 0;
	this.ySpeed = -1;
	this.update = function() {
		this.lastX = this.x;
		this.lastY = this.y;
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		snakeSegments.push(new SnakeSegment(this.lastX, this.lastY));
	}
	this.display = function() {
		noStroke();
		fill(0, 250, 154);
		rect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
	}
}

function SnakeSegment(x, y) {
	this.x = x;
	this.y = y;
	this.display = function () {
		noStroke();
		fill(0, 250, 154);
		rect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
	}
}