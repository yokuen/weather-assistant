import { DEFAULT_UNIT } from '../const.js';

export default class SettingsModel {
  #unit = DEFAULT_UNIT;

  constructor(unit = DEFAULT_UNIT) {
    this.#unit = unit;
  }

  get unit() {
    return this.#unit;
  }

  setUnit(unit) {
    this.#unit = unit;
  }
}
