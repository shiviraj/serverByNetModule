const getRandomFoodType = function() {
  return Math.floor(Math.random() * 5) > 3 ? 'special' : 'normal';
};

const getRandomFoodPosition = function() {
  const foodColNo = Math.floor(Math.random() * NUM_OF_ROWS);
  const foodRowNo = Math.floor(Math.random() * NUM_OF_COLS);
  return [foodRowNo, foodColNo];
};

const createFood = function() {
  const type = getRandomFoodType();
  const foodPosition = getRandomFoodPosition();
  return new Food(foodPosition, type);
};

class Game {
  #snake;
  #ghostSnake;
  #food;
  #score;
  #speedFactor;
  constructor(snake, ghostSnake, food, score) {
    this.#snake = snake;
    this.#ghostSnake = ghostSnake;
    this.#food = food;
    this.#score = score;
    this.#speedFactor = 2;
  }

  hasTouchedBoundaries() {
    const [headX, headY] = this.#snake.head;
    const hasTouchedVerticalWalls = headX < 0 || headX == NUM_OF_COLS;
    const hasTouchedHorizontalWalls = headY < 0 || headY == NUM_OF_ROWS;
    return hasTouchedHorizontalWalls || hasTouchedVerticalWalls;
  }

  isOver() {
    const ghostSnakeStatus = this.#ghostSnake.getStatus();
    return (
      this.#snake.hasTouchedItself() ||
      this.hasTouchedBoundaries() ||
      this.#snake.hasTouchedGhostSnake(ghostSnakeStatus.positions)
    );
  }

  getFoodDirection(foodStatus) {
    const [foodX, foodY] = foodStatus.position;
    const [headX, headY] = this.#ghostSnake.head;
    let direction = 'Down';
    if (foodX < headX) {
      direction = 'Left';
    }
    if (foodX > headX) {
      direction = 'Right';
    }
    if (foodY < headY) {
      direction = 'Up';
    }
    if (foodY > headY) {
      direction = 'Down';
    }
    return direction;
  }

  update() {
    const foodStatus = this.#food.getStatus();
    const direction = this.getFoodDirection(foodStatus);
    this.turn('ghostSnake', direction);
    this.moveSnakes();
    this.#ghostSnake.wrap();
    if (this.#snake.hasFoodEaten(foodStatus.position)) {
      this.#snake.grow();
      this.#score.updateScore(foodStatus.point);
      this.#food = createFood();
    }
    if (this.#ghostSnake.hasFoodEaten(foodStatus.position)) {
      this.#ghostSnake.grow();
      this.#food = createFood();
    }
  }

  getStatus() {
    return {
      snake: this.#snake.getStatus(),
      ghostSnake: this.#ghostSnake.getStatus(),
      food: this.#food.getStatus(),
      score: this.#score.getStatus()
    };
  }

  changeSpeedFactor(speedFactor) {
    if (speedFactor == 1 && this.#speedFactor < 5) {
      this.#speedFactor += speedFactor;
    }
    if (speedFactor == -1 && this.#speedFactor > 0) {
      this.#speedFactor += speedFactor;
    }
  }

  moveSnakes() {
    this.#snake.move(this.#speedFactor);
    this.#ghostSnake.move();
  }

  turn(snakeType, direction) {
    if (snakeType == 'snake') this.#snake.turn(direction);
    if (snakeType == 'ghostSnake') this.#ghostSnake.turn(direction);
  }
}
