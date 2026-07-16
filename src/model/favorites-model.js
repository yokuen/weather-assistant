export default class FavoritesModel {
  #cities = [];

  get cities() {
    return this.#cities;
  }

  setCities(cities) {
    this.#cities = cities;
  }
}
