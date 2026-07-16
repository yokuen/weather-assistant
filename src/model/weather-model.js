export default class WeatherModel {
  #weather = null;

  get weather() {
    return this.#weather;
  }

  setWeather(weather) {
    this.#weather = weather;
  }
}
