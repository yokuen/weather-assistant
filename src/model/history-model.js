import { HISTORY_LIMIT } from '../const.js';

export default class HistoryModel {
  #items = [];

  constructor(items = []) {
    this.#items = items;
  }

  get items() {
    return this.#items;
  }

  addItem(city) {
    const filteredItems = this.#items.filter((item) => item.city !== city.city);
    this.#items = [city, ...filteredItems].slice(0, HISTORY_LIMIT);
  }

  clear() {
    this.#items = [];
  }
}
