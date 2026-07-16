import AbstractView from './abstract-view.js';

export default class ForecastDayView extends AbstractView {
  constructor(forecastDay) {
    super();
    this._forecastDay = forecastDay;
  }

  get template() {
    const { dayLabel, condition, minTemperature, maxTemperature } = this._forecastDay;

    return `
      <article class="forecast-day">
        <p class="forecast-day__label">${dayLabel}</p>
        <h3 class="forecast-day__title">${condition}</h3>
        <p class="forecast-day__temperatures">
          От ${minTemperature}°C до ${maxTemperature}°C
        </p>
      </article>
    `;
  }
}
