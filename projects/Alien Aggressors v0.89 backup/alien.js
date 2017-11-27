function Alien(x, y, type, row, column) {
	this.xBase = x;
	this.y = y;
	this.row = row;
	this.column = column;
	this.type = type;
	this.alienHeight = 20;
	this.toDelete = false;
	if (this.type === 1) {
		this.alienWidth = 20;
		this.scoreValue = 40;
		this.correction = 5;
	} else if (this.type === 2) {
		this.alienWidth = 27;
		this.scoreValue = 20;
		this.correction = 2;
	} else if (this.type === 3) {
		this.alienWidth = 30;
		this.scoreValue = 10;
		this.correction = 0;
	}
	this.x = this.xBase + this.correction;
	this.display = function() {
		noTint()
		if (this.type === 1) {
			image(smallAlien, this.x, this.y)
		} else if (this.type === 2) {
			image(mediumAlien, this.x, this.y)
		} else {
			image(bigAlien, this.x, this.y)
		}
	}
	this.shoot = function() {
		this.rng = floor(random(0, enemyShootFrequency / globalSpeed));
		if (this.rng === 0 && this.lastAlien()) {
			alienProjectiles.push(new AlienProjectile(this.x + this.alienWidth/2, this.y + this.alienHeight, this.shootType()));
			alienBlasterSound.play();
		}
	}
	this.lastAlien = function () {
		returnVariable = true;
		for (i = 0; i < aliens.length; i++) {
			if (this.column === aliens[i].column && this.row < aliens[i].row) {
				returnVariable = false;
			}
		}
		return(returnVariable);
	}
	this.shootType = function () {
		return(floor(random(1, 3)))
	}
	this.hitsShield = function(shieldSegment) {
		if (this.x < shieldSegment.x + shieldSegment.alienWidth &&
    		this.x + this.alienWidth > shieldSegment.x &&
   			this.y < shieldSegment.y + shieldSegment.alienHeight &&
 			this.y + this.alienHeight > shieldSegment.y) {
   			return true;
  		} else {
    		return false;
		}
	}
}

function AlienProjectile(x, y, type) {
	if (type === 1) {
		this.tint = color(0, 255, 0);
		this.speed = enemyShootSpeed1;
	} else {
		this.tint = color(255);
		this.speed = enemyShootSpeed2;
	}
	this.x = x;
	this.y = y;
	this.toDelete = false;
	this.display = function() {
		noStroke();
		fill(this.tint);
		ellipse(this.x, this.y, 5);
	}
	this.update = function() {
		this.y += this.speed;
		if (this.x < -50 || this.x > width + 50) {
			this.toDelete = true;
		}
	}
	this.isFinished = function() {
		if (this.y > height || this.toDelete === true) {
			return(true);
		} else {
			return(false);
		}
	}
	this.hits = function(ship) {
		if (this.x > ship.xC - (this.y - ship.yC) && this.x < ship.xC + (this.y - ship.yC) && this.y > ship.yC && this.y < ship.yA) {
			return(true);
		} else {
			return(false);
		}
	}
	this.hitsObject = function(alien) {
		if (this.x > alien.x && this.x < alien.x + alien.alienWidth && this.y > alien.y && this.y < alien.y + alien.alienHeight) {
			return(true);
		} else {
			return(false);
		}
	}
}

function RedAlien(x, y, xSpeed) {
	this.toDelete = false;
	this.alienWidth = 42;
	this.alienHeight = 18;
	this.orientation = floor(random(0, 2));
	if (this.orientation === 1) {
		this.x = -1 * this.alienWidth;
		this.xSpeed = redAlienSpeed;
	} else {
		this.x = width + this.alienWidth;
		this.xSpeed = redAlienSpeed * -1;
	}
	this.scoreValue = floor(random(1, 8)) * 50;
	this.y = hudHeight + 7;
	this.display = function() {
		noTint()
		image(saucerImage, this.x, this.y)
	}
	this.update = function() {
		this.x += this.xSpeed;
		if (this.x > width + this.alienWidth || this.x < -1 * this.alienWidth) {
			this.toDelete = true;
		}
	}
	this.displayFloater = function() {
		effects.push(new ScoreFloater(this.x, this.y, this.scoreValue));
	}
}

function ScoreFloater(x, y, score) {
	this.x = x;
	this.y = y;
	this.score = score;
	this.tint = random(100, 255);
	this.timer = 60;
	this.display = function() {
		fill(this.tint);
		textSize(20);
		text(this.score, this.x, this.y)
	}
	this.update = function() {
		this.tint = random(150, 255);
		this.timer --;
	}
}

function moveSwarm() {
	var rightmostX = 0;
	var leftmostX = width;
	for (var i = 0; i < aliens.length; i++) {
		if (aliens[i].xBase + 30 > rightmostX) {
			rightmostX = aliens[i].xBase + 30;
		}
		if (aliens[i].xBase < leftmostX) {
			leftmostX = aliens[i].xBase;
			//console.log("asdf")
		}
	}
	if (swarmDirection === "moveRight") {
		var xSpeed = swarmSpeedX * globalSpeed;
		var ySpeed = 0;
		if (rightmostX >= width - 10) {
			swarmDirection = "moveDown1";
			swarmBuffer = 0;
		}
	}
	if (swarmDirection === "moveDown1") {
		xSpeed = 0;
		ySpeed = swarmSpeedY;
		swarmBuffer += swarmSpeedY
		if (swarmBuffer > enemyJumpDistance) {
			swarmDirection = "moveLeft";
		}
	}
	if (swarmDirection === "moveLeft") {
		xSpeed = swarmSpeedX * -1 * globalSpeed;
		ySpeed = 0;
		if (leftmostX <= 10) {
			swarmDirection = "moveDown2"
			swarmBuffer = 0;
		}
	}
	if (swarmDirection === "moveDown2") {
		xSpeed = 0;
		ySpeed = swarmSpeedY;
		swarmBuffer += swarmSpeedY;
		if (swarmBuffer > enemyJumpDistance) {
			swarmDirection = "moveRight";
		}
	}
	for (var i = 0; i < aliens.length; i++) {
		aliens[i].xBase += xSpeed;
		aliens[i].x = aliens[i].xBase + aliens[i].correction
		aliens[i].y += ySpeed;
	}
}