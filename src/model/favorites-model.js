export default class FavoritesModel {
  #cities = [];

  constructor(cities = []) {
    this.#cities = cities;
  }

  get cities() {
    return this.#cities;
  }

  hasCity(cityName) {
    return this.#cities.some((city) => city.city === cityName);
  }

  toggleCity(city) {
    if (this.hasCity(city.city)) {
      this.removeCity(city.city);
      return;
    }

    this.#cities = [city, ...this.#cities];
  }

  removeCity(cityName) {
    this.#cities = this.#cities.filter((city) => city.city !== cityName);
  }
}
