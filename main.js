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

// Create the board
let board = [];

for (r = 0; r < row; r++) {
  board[r] = [];
  for (c = 0; c < col; c++) {
    board[r][c] = boxColor;
  }
}

// Draw the board
function drawBoard() {
  for (r = 0; r < row; r++) {
    for (c = 0; c < col; c++) {
      drawSquare(c, r, board[r][c]);
    }
  }
}

drawBoard();