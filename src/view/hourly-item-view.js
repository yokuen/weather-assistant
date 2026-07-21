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
      <article class="hourly-item">
        <p class="hourly-item__time">${this._hourItem.time}</p>
        <p class="hourly-item__temp">${formatTemperature(this._hourItem.temperature, this._unit)}</p>
        <p class="hourly-item__meta">${this._hourItem.condition}</p>
        <p class="hourly-item__meta">Осадки: ${this._hourItem.chanceOfRain}%</p>
      </article>
    `;
  }
}
