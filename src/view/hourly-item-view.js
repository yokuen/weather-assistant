import AbstractView from './abstract-view.js';
import { formatTemperature } from '../utils/temperature.js';

export default class HourlyItemView extends AbstractView {
  constructor(hourItem, unit) {
    super();
    this._hourItem = hourItem;
    this._unit = unit;
  }

  get template() {
    return `
      <article class="hourly-card">
        <p class="hourly-card__time">${this._hourItem.time}</p>
        <img
          class="hourly-card__icon"
          src="${this._hourItem.conditionIcon}"
          alt="${this._hourItem.condition}"
        />
        <p class="hourly-card__temp">${formatTemperature(this._hourItem.temperature, this._unit)}</p>
        <p class="hourly-card__meta">Осадки: ${this._hourItem.chanceOfRain}%</p>
      </article>
    `;
  }
}
