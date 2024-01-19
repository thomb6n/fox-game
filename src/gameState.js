import {
  DAY_LENGTH,
  NIGHT_LENGTH,
  RAIN_CHANCE,
  SCENES,
  getNextDieTime,
  getNextHungerTime,
} from "./constants";
import { modFox, modScene } from "./ui";

const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1,
  sleepTime: -1,
  dieTime: -1,
  hungryTime: -1,
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
    modFox("idling");
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
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
    console.log("change weather");
  },
  cleanUpPoop() {
    console.log("clean poop");
  },
  feed() {
    console.log("feed");
  },
  handleUserAction(icon) {
    if (
      ["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)
    ) {
      return;
    }

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
