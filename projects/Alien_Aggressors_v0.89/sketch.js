//TO DO:
//difficulty rebalance 2nd etup
//saucer sound
//hitbox correction when alien hits shield
//level display?
//"press any key to conntinnue" on endgame screen
//move move related code in keyPressed()

//hud
//projectile color review
//end game screen with crashed ship?
//point of no return indicator

var effects = [];
var ship = [];
var projectiles = [];
var aliens = [];
var alienProjectiles = [];
var redAlien = [];
var shieldSegments = [];
var selector = [];

// SETTINGS
var hudHeight = 60;

var finalFrontier = 416;
var enemyShootSpeed1 = 4;
var enemyShootSpeed2 = 5.5;
var enemyShootFrequency = 2400;
var enemyJumpDistance = 15
var startingLives = 2;
var swarmSpeedX = 0.11;
var swarmSpeedY = 1;
var invincibilityLength = 120;
var playerSpeed = 4;
var playerShootSpeed = 7;
var redAlienFrequency = 840;
var redAlienSpeed = 1.75;
var maxSaucers = 5;

var p1Left = 37; //LEFT_ARROW
var p1Rigth = 39; //RIGHT_ARROW
var p1Shoot = 32; //space
var p2Left = 88; //X
var p2Rigth = 67; //C
var p2Shoot = 89; //Y
// END SETTINGS

var swarmDirection;
var swarmBuffer;
var score;
var state;
var level;
var lives
var globalSpeed
var playerBlasterSound;
var alienBlasterSound;
var playerMode = 1;
var saucerNumber;
var spawnInProgress
var spawnCounter

function preload() {
	playerBlasterSound = loadSound('sounds/204433__nhumphrey__blaster-01.wav');
	alienBlasterSound = loadSound('sounds/35686__jobro__laser9.wav');
	alienExplosionSound = loadSound('sounds/344506__jeremysykes__explosion04.wav');
	menuSelectSound = loadSound("sounds/328011__astrand__retro-blaster-fire.wav");
	startGameSound = loadSound("sounds/346116__lulyc__retro-game-heal-sound.wav");
	nukeBlastSound = loadSound("sounds/399303__dogfishkid__explosion-012.mp3");
	playerIsHit = loadSound("sounds/198969__thehorriblejoke__wub-wub-wub.mp3");

	player1Image = loadImage("images/23414568_1699002303507186_379875018_n.png");
	player2Image = loadImage("images/23364894_1699002306840519_1457780030_n.png");
	menuBackground = loadImage("images/23316016_1699014460172637_1328033604_n.png")
	gameBackground = loadImage("images/23315810_1699014463505970_1489957228_n.png")
	gameOverBackground = loadImage("images/23315824_1699014450172638_1539094952_n.png")
	smallAlien = loadImage("images/23318734_1698990926841657_555273922_n.png")
	mediumAlien = loadImage("images/23318762_1698990930174990_482864026_n.png")
	bigAlien = loadImage("images/23318488_1698990933508323_744652199_n.png")
	saucerImage = loadImage("images/23315957_1698998590174224_40032203_n.png")
	shieldImage = loadImage("images/shield_CUBE.png")
}

function setup() {
	createCanvas(640, 500);
	state = "mainMenu"
	selector.push(new Selector)
	masterVolume(0.25)
	playerBlasterSound.setVolume(0.5)
	alienBlasterSound.setVolume(0.5)
	alienExplosionSound.setVolume(0.25)
	menuSelectSound.setVolume(0.7)
	startGameSound.setVolume(0.5)
}

function draw() {
	background(0);
	if (state === "runGame") {
		runGame();
	} else if (state === "gameOverScreen") {
		gameOverScreen();
	} else if (state === "mainMenu") {
		mainMenu();
	}
}

function keyPressed() {
	if(state === "mainMenu") {
		if (keyIsDown(38) || keyIsDown(40)) { // UP or DOWN arrow
			selector[0].changeSelection()
		}
		if (keyIsDown(13) || keyIsDown(p1Shoot)) { // ENTER
			setupGame()
			startGameSound.play();
		}
	}
	if(state === "gameOverScreen") {
		state = "mainMenu"
	}
	/*if(keyIsDown(17)) {
		aliens.splice(0, aliens.length);
	}*/
	/*if(keyIsDown(17)) {
		redAlien.push(new RedAlien());
	}*/
}

function runGame() {
	//console.log(aliens.length)
	//console.log(ship[0].invincibilityTimer);
	//streamOBullets() // STREAM O" BULLETS FOR TROUBLESHOOTING
	noTint()
	image(gameBackground, 0, 0)
	statusBar();
	spawnRedAlien();
	spawn();
	checkNextLevel();
	updateDifficulty();
	checkGameOver();
	for (var i = 0; i < ship.length; i++) {
		ship[i].display();
		ship[i].update();
		ship[i].fire();
		if (aliens.length > 0) {
			if (aliens[aliens.length -1].y + aliens[aliens.length -1].alienHeight > finalFrontier) {
				ship[i].toDelete = true;
			}
		}
	}
	for (var i = 0; i < projectiles.length; i ++) {
		projectiles[i].display();
		projectiles[i].update();
		if (spawnInProgress === false) {
			for (var j = 0; j < aliens.length; j ++) {
				if (projectiles[i].hits(aliens[j])) {
					aliens[j].toDelete = true;
					projectiles[i].toDelete = true;
					score = score + aliens[j].scoreValue;
					explosion(aliens[j].x + aliens[j].alienWidth / 2, aliens[j].y + aliens[j].alienHeight / 2);
					//console.log("bumm");
				}
			}
		}
		for (var j = 0; j < redAlien.length; j ++) {
			if (projectiles[i].hits(redAlien[j])) {
				redAlien[j].toDelete = true;
				projectiles[i].toDelete = true;
				score = score + redAlien[j].scoreValue;
				explosion(redAlien[j].x + redAlien[j].alienWidth / 2, redAlien[j].y + redAlien[j].alienHeight / 2);
				redAlien[j].displayFloater()
			}
		}
		for (var j = 0; j < shieldSegments.length; j ++) {
			if (projectiles[i].hits(shieldSegments[j])) {
				projectiles[i].toDelete = true;
				shieldSegments[j].hp --;
			}
		}
	}
	for (var i = 0; i < alienProjectiles.length; i ++) {
		alienProjectiles[i].display();
		alienProjectiles[i].update();
		for (var j = 0; j < shieldSegments.length; j ++) {
			if (alienProjectiles[i].hitsObject(shieldSegments[j])) {
				alienProjectiles[i].toDelete = true;
				shieldSegments[j].hp --;
			}
		}
		for (var j = 0; j < ship.length; j ++) {
			if (alienProjectiles[i].hits(ship[j]) && ship[j].invincibilityTimer <= 0) {
				alienProjectiles[i].toDelete = true;
				if (lives > 0) {
					ship[j].invincible()
					lives--;
				} else {
					ship[j].toDelete = true;
				}
			}
		}
	}
	for (var i = 0; i < shieldSegments.length; i++) {
		shieldSegments[i].display();
	}
	for (var i =  0; i < aliens.length; i ++) {
		aliens[i].display();
		if (spawnInProgress === false) {
			aliens[i].shoot();
		}
		for (var j = 0; j < shieldSegments.length; j ++) {
			if (aliens[i].hitsShield(shieldSegments[j])) {
				aliens[i].toDelete = true;
				shieldSegments[j].hp = 0;
				explosion(aliens[i].x + aliens[i].alienWidth / 2, aliens[i].y + aliens[i].alienHeight / 2);
			}
		}
	}
	for (var i = 0; i < effects.length; i++) {
		effects[i].display()
		effects[i].update()
	}
	if (spawnInProgress === false){
		moveSwarm();
	}
	for (var i = 0; i < redAlien.length; i ++) {
		redAlien[i].display();
		redAlien[i].update();
	}
	// DELETE LOOPS
	for (var i = alienProjectiles.length - 1; i >= 0; i--) {
		if (alienProjectiles[i].isFinished()) {
			alienProjectiles.splice(i, 1);
		}
	}
	for (var i = projectiles.length - 1; i >= 0; i--) {
		if (projectiles[i].isFinished()) {
			projectiles.splice(i, 1);
		}
	}
	for (var i = aliens.length - 1; i >= 0; i--) {
		if (aliens[i].toDelete) {
			aliens.splice(i, 1);
		}
	}
	for (var i = redAlien.length - 1; i >= 0; i--) {
		if (redAlien[i].toDelete) {
			redAlien.splice(i, 1);
		}
	}
	for (var i = shieldSegments.length - 1; i >= 0; i--) {
		if (shieldSegments[i].hp <= 0) {
			shieldSegments.splice(i, 1);
		}
	}
	for (var i = effects.length - 1; i >= 0; i--) {
		if (effects[i].timer <= 0) {
			effects.splice(i, 1);
		}
	}
	for (var i = ship.length - 1; i >= 0; i--) {
		if (ship[i].toDelete) {
			effects.push(new NukeBlast(ship[i].xC, ship[i].yC));
			nukeBlastSound.play();
			ship.splice(i, 1);
		}
	}
}

function updateDifficulty() {
	if (aliens.length > 0) {
		globalSpeed = (1 + level * 1) * (1 + map(aliens.length, 0, 55, 1, 0)) * 
		(1 + map(aliens[0].y, 32 + hudHeight, finalFrontier - aliens[0].alienHeight, 0, 1));
	}
}

function checkNextLevel() {
	if (aliens.length === 0) {
		saucerNumber = 0;
		score += 1000;
		spawnInProgress = true;
		level++;
		if (playerMode === 2 && ship.length === 1) {
			if(ship[0].player === 1) {
				ship.push(new Ship(2));
			} else {
				ship.push(new Ship(1));
			}
			playerIsHit.play()
			ship[1].invincible()
		} else {
			lives++;
		}
	}
}

function checkGameOver() {
	if (ship.length === 0 && effects.length === 0) {
		state = "gameOverScreen"
	}
}

function spawn() {
	if (spawnInProgress) {
		var aliensPerRow = 11
		var x = 65;
		var y = 32 + hudHeight;
		if (spawnCounter <= aliensPerRow) {
			type = 1;
			i = 0
		} else if (spawnCounter <= aliensPerRow * 2) {
			type = 2;
			i = 1
		} else if (spawnCounter <= aliensPerRow * 3) {
			type = 2;
			i = 2
		} else if (spawnCounter <= aliensPerRow * 4) {
			type = 2;
			i = 3
		} else {
			type = 3;
			i = 4
		}
		j = spawnCounter - aliensPerRow * i;
		aliens.push(new Alien(j * 40 + x, i * 30 + y, type, i, j));
		swarmDirection = "moveRight";
		console.log(i)
		spawnCounter++;
		if(aliens.length === 55) {
			spawnInProgress = false;
			spawnCounter = 1;
		}
	}
}

function spawnRedAlien() {
	if (redAlien.length === 0 && floor(random(0, redAlienFrequency)) === 0 && saucerNumber < maxSaucers) {
		redAlien.push(new RedAlien());
		saucerNumber++
	}
}

function ShieldSegment(x, y) {
	this.x = x;
	this.y = y;
	this.hp = 4;
	this.alienWidth = 16;
	this.alienHeight = 16;
	this.display = function() {
		noTint()
		image(shieldImage, this.x, this.y)
		noStroke()
		fill(255, 0, 0, map(this.hp, 0, 4, 120, 0));
		rect(this.x, this.y, this.alienWidth, this.alienHeight);
	}
}

function spawnShield(x, y) {
	for (var i = 0; i < 2; i++) {
		for (var j = 0; j < 4; j++)
			shieldSegments.push(new ShieldSegment(x + (j * 16), y + (i * 16)));
	}
	shieldSegments.push(new ShieldSegment(x, y + (2 * 16)));
	shieldSegments.push(new ShieldSegment(x + (3 * 16), y + (2 * 16)));
}

function explosion(x, y) {
	var spread = 10;
	//console.log("explosion")
	for(var i = 0; i < 5; i++) {
		effects.push(new Flame(x + random(-1 * spread, spread),y + random(-1 * spread, spread)));
	}
	alienExplosionSound.play();
}

function Flame(x, y) {
	this.x = x;
	this.y = y;
	this.r = 15;
	this.timer = 255;
	this.yellow = random(0, 255);
	this.display = function() {
		noStroke();
		fill(255, this.yellow, 0, this.timer)
		ellipse(this.x, this.y, this.r)
	}
	this.update = function() {
		this.x += random(-1, 1);
		this.y += random(-1, 1);
		this.yellow = random(0, 255);
		this.timer -= 10
	}
}

function setupGame() {
	ship.splice(0, ship.length);
	projectiles.splice(0, projectiles.length);
	aliens.splice(0, aliens.length);
	alienProjectiles.splice(0, alienProjectiles.length);
	redAlien.splice(0, redAlien. length);

	spawnInProgress = true
	spawnCounter = 1;
	saucerNumber = 0;
	swarmDirection = "moveRight";
	swarmBuffer = 0;
	score = 0;
	state = "runGame"
	level = 1;
	lives = startingLives;
	spawnShield(75, height - 132);
	spawnShield(214, height - 132);
	spawnShield(width - 139, height - 132);
	spawnShield(width - 278, height - 132);
	ship.push(new Ship(1));
	if (playerMode === 2) {
		ship.push(new Ship(2));
	}
}

function NukeBlast(x, y) {
	this.x = x;
	this.y = y;
	this.r1 = 0;
	this.r2 = 0;
	this.timer = 120;
	this.alpha = 200;
	this.yellow = random(0, 255);
	this.display = function() {
		noStroke();
		fill(255, this.yellow, 0, this.alpha);
		ellipse(this.x, this.y, this.r1, this.r2)
	}
	this.update = function() {
		this.timer --
		this.yellow = random(0, 255);
		if(this.timer > 50) {
			this.r1 += 7
			this.r2 = this.r1 * 0.66
		}
		if(this.timer < 20) {
			this.alpha -= 10
		}
	}
}

// STREAM OF BULLETS - for debugging
/*var streamOBulletsTimer = 0;

function streamOBullets() {
	if (streamOBulletsTimer >= 10) {
		alienProjectiles.push(new AlienProjectile(width / 2, height / 2));
		streamOBulletsTimer = 0;
	}
	streamOBulletsTimer ++;
}*/