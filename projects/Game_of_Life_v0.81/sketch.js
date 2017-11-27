var cells = [];
var cellSize = 10;

var lastColumn
var lastRow
var simulate = false;
var randomRatio = 25;

//var testX = 0
//var testY = 0

function setup() {
	frameRate(60)
	createCanvas(1200, 700);
	populate()
	//cells[testX][testY].isAlive = true
}

function draw() {
	//console.log(lastColumn)
	background(170);
	for (var x = 0; x < cells.length; x++) {
    	for (var y = 0; y < cells[x].length; y++) {
    		cells[x][y].update();
    		cells[x][y].display();
    		if(mouseIsPressed && mouseButton === LEFT) {
    			cells[x][y].clicked();
    		}
    		if(simulate) {
    			cells[x][y].detNextState()
    		}
    	}
  	}
  	if (simulate) {
  		for (var x = 0; x < cells.length; x++) {
    		for (var y = 0; y < cells[x].length; y++) {
    			cells[x][y].isAlive = cells[x][y].aliveNextFrame;
    		}
 	 	}
 	}
  	//console.log(cells[testX][testY].checkNeighbors())
}

function Cell(x, y, column, row) {
	this.isAlive = false
	this.aliveNextFrame = this.isAlive;
	this.column = column;
	this.row = row;
	this.x = x;
	this.y = y;
	this.neighbors
	this.update = function() {
		if (this.isAlive) {
			this.tint = color(0, 255, 0);
		} else {
			this.tint = color(0);
		}
	}
	this.display = function() {
		noStroke();
		fill(this.tint);
		rect(this.x, this.y, cellSize, cellSize);
	}
	this.clicked = function() {
		if(mouseX >= this.x && mouseX <= this.x + cellSize && mouseY >= this.y && mouseY <= this.y + cellSize) {
			this.isAlive = true;
			this.aliveNextFrame = true;
		}
	}
	this.checkNeighbors = function() {
		this.neighbors = 0;
		var i = this.column - 1
		if (i < 0) {
			i = 0;
		}
		var xFor = this.column + 1;
		if (xFor > lastColumn) {
			xFor = lastColumn;
		}
		var j
		var yFor
		for (i; i <= xFor; i++) {
			j = this.row - 1
			if (j < 0) {
				j = 0;
			}
			yFor = this.row + 1;
			if (yFor > lastRow) {
				yFor = lastRow;
			}
			for (j; j <= yFor; j++) {
				if (cells[i][j].isAlive && (this.column === i && this.row === j) === false) {
					this.neighbors++
				}
			}
		}
		//return(neighbors)
	}
	this.detNextState = function() {
		this.checkNeighbors()
		if (this.isAlive === true) {
			if (this.neighbors <= 1 || this.neighbors >= 4) {
				this.aliveNextFrame = false;
			}
		} else {
			if (this.neighbors === 3) {
				this.aliveNextFrame = true;
			}
		}
	}
}

function populate() {
	var spacer = 1

	for (var x = 0; spacer + x * (cellSize + spacer) < width; x++) {
   		cells[x] = []; // create nested array
   		lastColumn = x;
    	for (var y = 0; spacer + y * (cellSize + spacer) < height; y++) {
    		cells[x].push(new Cell(spacer + x * (cellSize + spacer), spacer + y * (cellSize + spacer), x, y));
    		lastRow = y;
    	}
  	}
}

function keyPressed() {
	if (keyIsDown(32)) { // SPACE
		//cells[testX][testY].detNextState()
		if (simulate) {
			simulate = false;
		} else {
			simulate = true;
		}
	}
	if (keyIsDown(17)) {
		for (var x = 0; x < cells.length; x++) {
    		for (var y = 0; y < cells[x].length; y++) {
    			if (random(0, 99) < randomRatio) {
    				var rng = true;
    			} else {
    				var rng = false;
    			}
    			cells[x][y].isAlive = rng;
    			cells[x][y].aliveNextFrame = rng;
    		}
 	 	}
	}
}