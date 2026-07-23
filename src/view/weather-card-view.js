import AbstractView from './abstract-view.js';
import { formatTemperature } from '../utils/temperature.js';
import { formatAstroTime, formatLocalTime } from '../utils/date.js';

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
      conditionIcon,
      temperature,
      feelsLike,
      humidity,
      windSpeed,
      uv,
      chanceOfRain,
      localTime,
      forecastDate,
      minTemperature,
      maxTemperature,
      sunrise,
      sunset,
    } = this._weather;
    const isForecast = Boolean(forecastDate);
    const timeLabel = isForecast ? '' : `Локальное время: ${formatLocalTime(localTime)}`;
    const temperatureLabel = isForecast
      ? `От ${formatTemperature(minTemperature, this._unit)} до ${formatTemperature(maxTemperature, this._unit)}`
      : `Ощущается как ${formatTemperature(feelsLike, this._unit)}`;
    const lastStat = isForecast
      ? `
        <div class="weather-card__stat">
          <p class="weather-card__stat-label">Световой день</p>
          <p class="weather-card__stat-value">
            ${formatAstroTime(sunrise)} — ${formatAstroTime(sunset)}
          </p>
        </div>
      `
      : `
        <div class="weather-card__stat">
          <p class="weather-card__stat-label">УФ-индекс</p>
          <p class="weather-card__stat-value">${uv}</p>
        </div>
      `;

    return `
      <article class="weather-card">
        <div class="weather-card__top">
          <div class="weather-card__header">
            <h3 class="weather-card__city">${city}</h3>
            <p class="weather-card__meta">${country}</p>
            <p class="weather-card__description">${description}</p>
            ${timeLabel ? `<p class="weather-card__time">${timeLabel}</p>` : ''}
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
          <img
            class="weather-card__icon"
            src="${conditionIcon}"
            alt="${description}"
          >
          <span class="weather-card__value">${formatTemperature(temperature, this._unit)}</span>
          <span class="weather-card__feels-like">${temperatureLabel}</span>
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
            <p class="weather-card__stat-label">Осадки</p>
            <p class="weather-card__stat-value">${chanceOfRain}%</p>
          </div>

          ${lastStat}
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
