import AbstractView from './abstract-view.js';
import { formatTemperature } from '../utils/temperature.js';

export default class ForecastDayView extends AbstractView {
  constructor(forecastDay, unit) {
    super();
    this._forecastDay = forecastDay;
    this._unit = unit;
  }

  get template() {
    const { dayLabel, condition, minTemperature, maxTemperature } = this._forecastDay;

    return `
      <article class="forecast-day">
        <p class="forecast-day__label">${dayLabel}</p>
        <h3 class="forecast-day__title">${condition}</h3>
        <p class="forecast-day__temperatures">
          От ${formatTemperature(minTemperature, this._unit)} до ${formatTemperature(maxTemperature, this._unit)}
        </p>
      </article>
    `;
  }
}
