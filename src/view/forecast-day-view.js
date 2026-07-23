import AbstractView from './abstract-view.js';
import { formatTemperature } from '../utils/temperature.js';
import { formatForecastDate } from '../utils/date.js';

export default class ForecastDayView extends AbstractView {
  constructor({ forecastDay, unit, onDaySelect, isActive }) {
    super();
    this._forecastDay = forecastDay;
    this._unit = unit;
    this._onDaySelect = onDaySelect;
    this._isActive = isActive;

    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  get template() {
    return `
      <button class="forecast-day ${this._isActive ? 'is-active' : ''}" type="button">
        <p class="forecast-day__label">${formatForecastDate(this._forecastDay.dayLabel)}</p>
        <img
          class="forecast-day__icon"
          src="${this._forecastDay.conditionIcon}"
          alt="${this._forecastDay.condition}"
        >
        <h3 class="forecast-day__title">${this._forecastDay.condition}</h3>
        <p class="forecast-day__temperatures">
          От ${formatTemperature(this._forecastDay.minTemperature, this._unit)}
          до ${formatTemperature(this._forecastDay.maxTemperature, this._unit)}
        </p>
      </button>
    `;
  }

  #buttonClickHandler = () => {
    this._onDaySelect(this._forecastDay);
  };
}
