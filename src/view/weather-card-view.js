import AbstractView from './abstract-view.js';
import { formatTemperature } from '../utils/temperature.js';

export default class WeatherCardView extends AbstractView {
  constructor({ weather, unit, isFavorite, onFavoriteToggle, onUnitChange }) {
    super();
    this._weather = weather;
    this._unit = unit;
    this._isFavorite = isFavorite;
    this._onFavoriteToggle = onFavoriteToggle;
    this._onUnitChange = onUnitChange;

    this.element.querySelector('.weather-card__favorite')
      .addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelectorAll('.weather-card__unit-button')
      .forEach((button) => button.addEventListener('click', this.#unitClickHandler));
  }

  get template() {
    const {
      city,
      country,
      description,
      temperature,
      feelsLike,
      humidity,
      windSpeed,
      localTime,
    } = this._weather;

    return `
      <article class="weather-card">
        <div class="weather-card__top">
          <div class="weather-card__header">
            <h3 class="weather-card__city">${city}</h3>
            <p class="weather-card__meta">${country}</p>
            <p class="weather-card__description">${description}</p>
            <p class="weather-card__time">${localTime}</p>
          </div>

          <div class="weather-card__actions">
            <button class="weather-card__favorite" type="button">
              ${this._isFavorite ? 'Убрать из избранного' : 'В избранное'}
            </button>

            <div class="weather-card__units">
              <button
                class="weather-card__unit-button ${this._unit === 'celsius' ? 'is-active' : ''}"
                type="button"
                data-unit="celsius"
              >
                °C
              </button>
              <button
                class="weather-card__unit-button ${this._unit === 'fahrenheit' ? 'is-active' : ''}"
                type="button"
                data-unit="fahrenheit"
              >
                °F
              </button>
            </div>
          </div>
        </div>

        <div class="weather-card__temperature">
          <span class="weather-card__value">${formatTemperature(temperature, this._unit)}</span>
          <span class="weather-card__feels-like">
            Ощущается как ${formatTemperature(feelsLike, this._unit)}
          </span>
        </div>

        <div class="weather-card__stats">
          <div class="weather-card__stat">
            <p class="weather-card__stat-label">Влажность</p>
            <p class="weather-card__stat-value">${humidity}%</p>
          </div>

          <div class="weather-card__stat">
            <p class="weather-card__stat-label">Ветер</p>
            <p class="weather-card__stat-value">${windSpeed} км/ч</p>
          </div>

          <div class="weather-card__stat">
            <p class="weather-card__stat-label">Единицы</p>
            <p class="weather-card__stat-value">${this._unit === 'fahrenheit' ? '°F' : '°C'}</p>
          </div>
        </div>
      </article>
    `;
  }

  #favoriteClickHandler = () => {
    this._onFavoriteToggle(this._weather);
  };

  #unitClickHandler = (evt) => {
    this._onUnitChange(evt.currentTarget.dataset.unit);
  };
}
