export default class HistoryModel {
  #items = [];

  get items() {
    return this.#items;
  }

  setItems(items) {
    this.#items = items;
  }
}
