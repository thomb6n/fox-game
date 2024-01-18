const states = [
  "INIT",
  "HATCHING",
  "IDLING",
  "SLEEPING",
  "EATING",
  "POOPING",
  "HUNGRY",
  "CELEBRATING",
  "DEAD",
];

const gameState = {
  current: "INIT",
  clock: 1,
  tick() {
    this.clock++;
    console.log("clock", this.clock);
  },
};

export default gameState;
