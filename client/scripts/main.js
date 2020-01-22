const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const TIME_LIMIT = 120;
const INITIAL_SCORE = 0;

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => 'cell' + colId + '_' + rowId;

const getCell = (colId, rowId) => {
  return document.getElementById(getCellId(colId, rowId));
};

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const showScore = function(score) {
  const scoreBox = document.getElementsByClassName('score');
  scoreBox[0].innerText = `score : ${score}`;
};

const displayGameOver = function(scoreBoard) {
  const panel = document.getElementsByClassName('gameOver');
  const panelContent = document.getElementsByClassName('status');
  panel[0].style.marginTop = `0vw`;
  panelContent[0].innerText = `Your score:${scoreBoard}`;
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.type);
};

const drawSnake = function(snake) {
  const {positions, type} = snake;
  positions.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(type);
  });
};

const drawFood = function(food) {
  const [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.add(food.type);
};

const removeFood = function() {
  const food =
    document.querySelector('.normal') || document.querySelector('.special');
  food.classList.remove('normal');
  food.classList.remove('special');
};

const updateTimeLeft = function(count) {
  const timer = document.getElementsByClassName('timer');
  timer[0].innerText = `Time Left: ${count}s`;
};

const handleKeyPress = game => {
  const input = event.key;

  switch (input) {
    case 'ArrowLeft':
      game.turn('snake', 'Left');
      break;

    case 'ArrowRight':
      game.turn('snake', 'Right');
      break;

    case 'ArrowUp':
      game.turn('snake', 'Up');
      break;

    case 'ArrowDown':
      game.turn('snake', 'Down');
      break;

    case 'Enter':
      alert('click on ok to resume');
      break;

    case 's':
      game.changeSpeedFactor(1);
      break;

    case 'a':
      game.changeSpeedFactor(-1);
      break;
  }
};

const attachEventListeners = game => {
  window.addEventListener('keydown', handleKeyPress.bind(null, game));
};

const drawGame = function(status) {
  drawSnake(status.snake);
  drawSnake(status.ghostSnake);
  drawFood(status.food);
  showScore(status.score);
};

const eraseGame = function(status) {
  removeFood();
  eraseTail(status.ghostSnake);
  eraseTail(status.snake);
};

const isGameOver = function(game, timer) {
  return game.isOver() || timer.isTimeOut();
};

const clearTimers = function(timerIds) {
  timerIds.forEach(id => clearInterval(id));
};

const initGame = function(game, status) {
  createGrids();
  attachEventListeners(game);
  drawGame(status);
};

const createGame = function() {
  const snake = new Snake(
    [
      [40, 25],
      [41, 25],
      [42, 25]
    ],
    new Direction(EAST),
    'snake',
    2
  );
  const ghostSnake = new Snake(
    [
      [40, 30],
      [41, 30],
      [42, 30]
    ],
    new Direction(SOUTH),
    'ghost',
    2
  );
  const food = new Food([44, 55], 'normal');
  const score = new Score(INITIAL_SCORE);
  return new Game(snake, ghostSnake, food, score);
};

const main = function() {
  const game = createGame();
  let status = game.getStatus();
  initGame(game, status);
  const timer = new Timer(TIME_LIMIT);
  const timerId = timer.start();

  const gameTimerId = setInterval(() => {
    game.update();
    if (isGameOver(game, timer)) {
      clearTimers([gameTimerId, timerId]);
      displayGameOver(status.score);
      return;
    }
    status = game.getStatus();
    eraseGame(status);
    drawGame(status);
  }, 50);
};

window.onload = main;
