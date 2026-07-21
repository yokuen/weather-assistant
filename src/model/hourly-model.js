export default class HourlyModel {
  #items = [];

  get items() {
    return this.#items;
  }

  setItems(items) {
    this.#items = items;
  }
}
