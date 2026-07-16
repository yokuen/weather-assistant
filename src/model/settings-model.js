import { DEFAULT_UNIT } from '../const.js';

export default class SettingsModel {
  #unit = DEFAULT_UNIT;

  get unit() {
    return this.#unit;
  }

  setUnit(unit) {
    this.#unit = unit;
  }
}
