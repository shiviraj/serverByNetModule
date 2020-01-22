class Timer {
  #timeLimit;
  constructor(timeLimit) {
    this.#timeLimit = timeLimit;
  }

  start() {
    const timerId = setInterval(() => {
      updateTimeLeft(this.#timeLimit);
      this.#timeLimit--;
    }, 1000);
    return timerId;
  }

  isTimeOut() {
    return this.#timeLimit < 0;
  }
}
