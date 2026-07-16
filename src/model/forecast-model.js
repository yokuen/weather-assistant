export default class ForecastModel {
  #forecast = [];

  get forecast() {
    return this.#forecast;
  }

  setForecast(forecast) {
    this.#forecast = forecast;
  }
}
