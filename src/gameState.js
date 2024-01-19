import {
  DAY_LENGTH,
  NIGHT_LENGTH,
  RAIN_CHANCE,
  SCENES,
  getNextDieTime,
  getNextHungerTime,
  getNextPoopTime,
} from "./constants";
import { modFox, modScene, togglePoopBag } from "./ui";

const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1,
  sleepTime: -1,
  dieTime: -1,
  hungryTime: -1,
  celebrationBegins: -1,
  celebrationEnds: -1,
  poopTime: -1,
  tick() {
    this.clock++;
    console.log("clock", this.clock);

    if (this.clock === this.wakeTime) {
      this.wake();
    } else if (this.clock === this.sleepTime) {
      this.sleep();
    } else if (this.clock === this.hungryTime) {
      this.getHungry();
    } else if (this.clock === this.dieTime) {
      this.die();
    } else if (this.clock === this.celebrationBegins) {
      this.startCelebrating();
    } else if (this.clock === this.celebrationEnds) {
      this.endCelebrating();
    } else if (this.clock === this.poopTime) {
      this.poop();
    }
  },
  startGame() {
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    modFox("egg");
    modScene("day");
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determineFoxState();
  },
  sleep() {
    this.current = "SLEEP";
    modFox("sleep");
    modScene("night");
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  getHungry() {
    this.current = "HUNGRY";
    this.dieTime = getNextDieTime(this.clock);
    this.hungryTime = -1;
    modFox("hungry");
  },
  die() {
    console.log("die");
  },
  changeWeather() {
    this.scene = (this.scene + 1) % SCENES.length;
    modScene(SCENES[this.scene]);
    this.determineFoxState();
  },
  cleanUpPoop() {
    if (this.current !== "POOPING") return;

    this.dieTime = -1;
    togglePoopBag(true);
    this.startCelebrating();
    this.hungryTime = getNextHungerTime(this.clock);
  },
  startCelebrating() {
    this.current = "CELEBRATING";
    modFox("celebrate");
    this.celebrationBegins = -1;
    this.celebrationEnds = this.clock + 2;
  },
  endCelebrating() {
    this.celebrationEnds = -1;
    this.current = "IDLING";
    this.determineFoxState();
    togglePoopBag(false);
  },
  determineFoxState() {
    if (this.current === "IDLING") {
      if (SCENES[this.scene] === "rain") {
        modFox("rain");
      } else {
        modFox("idling");
      }
    }
  },
  feed() {
    if (this.current !== "HUNGRY") return;

    this.current = "FEEDING";
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    modFox("eating");
    this.celebrationBegins = this.clock + 2;
  },
  poop() {
    this.current = "POOPING";
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox("pooping");
  },
  handleUserAction(icon) {
    if (["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current))
      return;

    if (["DEAD", "INIT"].includes(this.current)) {
      this.startGame();
      return;
    }

    switch (icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanUpPoop();
        break;
      case "fish":
        this.feed();
        break;
      default:
        break;
    }
  },
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
