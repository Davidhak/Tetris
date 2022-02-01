const container = document.getElementById('tetris');
const context = container.getContext('2d');
const scoreText = document.getElementById('score');

const row = 20;
const col = column = 10;
const boxColor = "black";
const square = 20;

// Draw a square
function drawSquare(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * square, y * square, square, square);
  context.strokeStyle = "white"
  context.strokeRect(x * square, y * square, square, square);
}

// Create the canvas
let canvas = [];

for (r = 0; r < row; r++) {
  canvas[r] = [];
  for (c = 0; c < col; c++) {
    canvas[r][c] = boxColor;
  }
}

// Draw the canvas
function drawBoard() {
  for (r = 0; r < row; r++) {
    for (c = 0; c < col; c++) {
      drawSquare(c, r, canvas[r][c]);
    }
  }
}

drawBoard();

// Pieces and their colors
const pieces = [
  [Z, "blue"],
  [S, "green"],
  [T, "yellow"],
  [O, "red"],
  [L, "purple"],
  [I, "cyan"],
  [J, "orange"]
];

//Generate random pieces
function randomPiece() {
  let r = randomN = Math.floor(Math.random() * pieces.length);
  return new Piece(pieces[r][0], pieces[r][1]);
}

let rp = randomPiece();

//The Piece Object
function Piece(shape, color) {
  this.shape = shape;
  this.color = color;

  this.shape1 = 0; // we start from the first pattern
  this.activeShape = this.shape[this.shape1];

  this.x = 3;
  this.y = -2;
}

// fill function
Piece.prototype.fill = function (color) {
  for (r = 0; r < this.activeShape.length; r++) {
    for (c = 0; c < this.activeShape.length; c++) {

      if (this.activeShape[r][c]) { //If square is occupied - draw
        drawSquare(this.x + c, this.y + r, color);
      }
    }
  }
}

// draw a piece to the board
Piece.prototype.draw = function () {
  this.fill(this.color);
}

// undraw a piece
Piece.prototype.unDraw = function () {
  this.fill(boxColor);
}

// move Down the piece
Piece.prototype.moveDown = function () {
  if (!this.collision(0, 1, this.activeShape)) {
    this.unDraw();
    this.y++;
    this.draw();
  } else {
    // Lock the piece and generate a new one
    this.lock();
    rp = randomPiece();
  }
}

// move the piece to the Right
Piece.prototype.moveRight = function () {
  if (!this.collision(1, 0, this.activeShape)) {
    this.unDraw();
    this.x++;
    this.draw();
  }
}

// move the piece to the Left
Piece.prototype.moveLeft = function () {
  if (!this.collision(-1, 0, this.activeShape)) {
    this.unDraw();
    this.x--;
    this.draw();
  }
}

// rotate the piece
Piece.prototype.rotate = function () {
  let nextShape = this.shape[(this.shape1 + 1) % this.shape.length];
  let force = 0;

  if (this.collision(0, 0, nextShape)) {
    if (this.x > col / 2) { //If collision with the right wall
      force = -1;           // Must move the piece to the left
    } else {     // if collision with the left wall
      force = 1; // Must move the piece to the right
    }
  }

  if (!this.collision(force, 0, nextShape)) {
    this.unDraw();
    this.x += force;
    this.shape1 = (this.shape1 + 1) % this.shape.length; 1
    this.activeShape = this.shape[this.shape1];
    this.draw();
  }
}

let score = 0;

Piece.prototype.lock = function () {
  for (r = 0; r < this.activeShape.length; r++) {
    for (c = 0; c < this.activeShape.length; c++) {
      if (!this.activeShape[r][c]) { // we skip the non occupied squares
        continue;
      }
      // if pieces lock on top => game over
      if (this.y + r < 0) {
        alert("Game Over");
        gameOver = true;
        break;
      }
      canvas[this.y + r][this.x + c] = this.color;
    }
  }
  // remove full rows
  for (r = 0; r < row; r++) {
    let isRowFull = true;
    for (c = 0; c < col; c++) {
      isRowFull = isRowFull && (canvas[r][c] != boxColor);
    }
    if (isRowFull) {
      // Move down all the rows above it
      for (y = r; y > 1; y--) {
        for (c = 0; c < col; c++) {
          canvas[y][c] = canvas[y - 1][c];
        }
      }
      // Tells that the top row has no row above it
      for (c = 0; c < col; c++) {
        canvas[0][c] = boxColor;
      }
      // increment the score
      score += 10;
    }
  }
  // update the board
  drawBoard();

  // update the score
  scoreText.innerHTML = score;
}

// collision function
Piece.prototype.collision = function (x, y, piece) {
  for (r = 0; r < piece.length; r++) {
    for (c = 0; c < piece.length; c++) {
      // if the square is empty, we skip it
      if (!piece[r][c]) {
        continue;
      }
      // coordinates of the piece after movement
      let newX = this.x + c + x;
      let newY = this.y + r + y;

      // conditions
      if (newX < 0 || newX >= col || newY >= row) {
        return true;
      }

      if (newY < 0) {
        continue;
      }
      // check if there is a locked piece already in place
      if (canvas[newY][newX] != boxColor) {
        return true;
      }
    }
  }
  return false;
}

// CONTROL the piece
document.addEventListener("keydown", control);

function control(event) {
  if (event.keyCode == 37) {
    rp.moveLeft();
    startDrop = Date.now();
  } else if (event.keyCode == 38) {
    rp.rotate();
    startDrop = Date.now();
  } else if (event.keyCode == 39) {
    rp.moveRight();
    startDrop = Date.now();
  } else if (event.keyCode == 40) {
    rp.moveDown();
  }
}

// drop the piece every 1sec
let startDrop = Date.now();
let gameOver = false;

function drop() {
  let now = Date.now();
  let delta = now - startDrop;
  if (delta > 1000) {
    rp.moveDown();
    startDrop = Date.now();
  }
  if (!gameOver) {
    requestAnimationFrame(drop);
  }
}

drop();