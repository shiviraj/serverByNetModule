const pointsOfFood = {
  normal: 1,
  special: 5
};

class Food {
  #position;
  #foodType;
  #point;
  constructor(position, type) {
    this.#position = position.slice();
    this.#foodType = type;
    this.#point = pointsOfFood[this.#foodType];
  }

  getStatus() {
    const foodStatus = {};
    foodStatus.position = this.#position.slice();
    foodStatus.type = this.#foodType;
    foodStatus.point = this.#point;
    return foodStatus;
  }
}
