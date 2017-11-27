function Ship(player) {
	this.invincibilityTimer = 0;
	this.player = player;
	this.toDelete = false;
	if (this.player === 1) {
		this.xC = width - 107;
		this.left = p1Left;
		this.right = p1Rigth;
		this.shoot = p1Shoot;
	} else {
		this.xC = 107;
		this.left = p2Left;
		this.right = p2Rigth;
		this.shoot = p2Shoot;
	}
	this.yC = height - 50;
	this.xA = this.xC - 20;
	this.yA = height - 30;
	this.xB = this.xC + 20;
	this.yB = height - 30;
	this.display = function() {
		if (this.invincibilityTimer > 0) {
			this.invincibilityTimer--;
			tint(255, random(0,255));
		} else {
			noTint()
		}
		if (this.player === 1) {
			image(player1Image, this.xA, this.yC);
		} else {
			image(player2Image, this.xA, this.yC);
		}
		
	}
	this.update = function() {
		if (keyIsDown(this.left) && this.xA > 10) {
			this.xA -= playerSpeed;
			this.xB -= playerSpeed;
			this.xC -= playerSpeed;
		}
		if (keyIsDown(this.right) && this.xB < width - 10) {
			this.xA += playerSpeed;
			this.xB += playerSpeed;
			this.xC += playerSpeed;
		}
	}
	this.fire = function() {
		if (keyIsDown(this.shoot) && this.projectileExists() === false) {
			projectiles.push(new Projectile(this.player, this.xC, this.yC));
			playerBlasterSound.play();
		}
	}
	this.projectileExists = function() {
		exists = false
		for (var i = 0; i < projectiles.length; i ++) {
			if (projectiles[i].player === this.player) {
				exists = true;
			}
		}
		return(exists);
	}
	this.invincible = function() {
		playerIsHit.play()
		this.invincibilityTimer = invincibilityLength;
	}
}

function Projectile(player, x, y) {
	this.player = player;
	if (player === 1) {
		this.tint = color(0, 255, 255);
	} else {
		this.tint = color(255, 69, 0);
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
		this.y -= playerShootSpeed;

	}
	this.isFinished = function() {
		if (this.y < hudHeight || this.toDelete === true) {
			return(true);
		} else {
			return(false);
		}
	}
	this.hits = function(alien) {
		if (this.x >= alien.x && this.x <= alien.x + alien.alienWidth && this.y >= alien.y && this.y <= alien.y + alien.alienHeight) {
			return(true);
		} else {
			return(false);
		}
	}
}