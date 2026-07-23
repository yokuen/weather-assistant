export default class ForecastModel {
  #forecast = [];
  #selectedDay = null;

  get forecast() {
    return this.#forecast;
  }

  get selectedDay() {
    return this.#selectedDay;
  }

  setForecast(forecast) {
    this.#forecast = forecast;
  }

  setSelectedDay(day) {
    this.#selectedDay = day;
  }
}
