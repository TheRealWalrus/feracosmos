function statusBar() {
	textSize(20);
	fill(255);
	text("SCORE   " + score, 20, 40);
	text("LIVES   " + lives, width - 120, 40);
}

function gameOverScreen() {
	noTint()
	image(gameOverBackground, 0, 0)
	fill(255);
	textSize(45);
	text("GAME OVER", 190, 200);
	textSize(20);
	text("SCORE:  " + score, 250, 250);
}

function mainMenu() {
	noTint()
	image(menuBackground, 0, 0)
	textSize(45);
	text("ALIEN AGGRESSORS", 110, 160);
	textSize(20);
	text("1 PLAYER", 250, 250);
	text("2 PLAYERS", 250, 300);
	fill(255, 0, 0);
	textSize(20);
	text("ART: BALAGE", 480, 415);
	text("CODE: FERA", 480, 440);
	selector[0].display();
	selector[0].update();
}

function Selector() {
	playerMode = 1
	this.x = 238;
	this.y = 243;
	this.size = 15;
	this.display = function() {
		noStroke();
		fill(255);
		triangle(this.x, this.y, this.x - this.size, this.y - this.size, this.x - this.size, this.y + this.size)
	}
	this.update = function() {
		if (playerMode === 1) {
			this.y = 243;
		} else {
			this.y = 293;
		}
	}
	this.changeSelection = function() {
		if (playerMode === 1) {
			playerMode = 2;
		} else if (playerMode === 2) {
			playerMode = 1;
		}
		menuSelectSound.play()
	}
}