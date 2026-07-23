import AbstractView from './abstract-view.js';

export default class SearchFormView extends AbstractView {
  constructor({
    onSubmit,
    onGeolocationClick,
    onInput,
    onSuggestionClick,
    message = '',
    suggestions = [],
    value = '',
  }) {
    super();
    this._onSubmit = onSubmit;
    this._onGeolocationClick = onGeolocationClick;
    this._onInput = onInput;
    this._onSuggestionClick = onSuggestionClick;
    this._message = message;
    this._suggestions = suggestions;
    this._value = value;

    this._formElement = this.element.querySelector('.search-panel__form');
    this._inputElement = this.element.querySelector('.search-panel__input');
    this._inputElement.value = this._value;
    this._formElement.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.search-panel__geo-button')
      .addEventListener('click', this.#geoButtonClickHandler);
    this._inputElement.addEventListener('input', this.#inputHandler);
    this.element.querySelectorAll('.search-panel__suggestion')
      .forEach((button) => button.addEventListener('click', this.#suggestionClickHandler));
  }

  get template() {
    return `
      <section class="search-panel__inner">
        <h1 class="search-panel__title">Найдите город</h1>
        <p class="search-panel__text">
          Введите название города или определите погоду по местоположению.
        </p>

        <form class="search-panel__form">
          <div class="search-panel__input-box">
            <input
              class="search-panel__input"
              name="city"
              type="text"
              placeholder="Например, Екатеринбург"
              autocomplete="off"
            />
            ${this.#createSuggestionsTemplate()}
          </div>

          <div class="search-panel__actions">
            <button class="search-panel__geo-button" type="button">Моя погода</button>
            <button class="search-panel__button" type="submit">Показать погоду</button>
          </div>
        </form>

        <p class="search-panel__status">${this._message}</p>
      </section>
    `;
  }

  #createSuggestionsTemplate() {
    if (!this._suggestions.length) {
      return '';
    }

    return `
      <div class="search-panel__suggestions">
        ${this._suggestions.map((suggestion) => `
          <button
            class="search-panel__suggestion"
            type="button"
            data-name="${suggestion.name}"
            data-region="${suggestion.region}"
            data-country="${suggestion.country}"
            data-latitude="${suggestion.latitude}"
            data-longitude="${suggestion.longitude}"
          >
            <span>${suggestion.name}</span>
            <span>${suggestion.country}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const formData = new FormData(this._formElement);
    const city = formData.get('city') ?? '';

    this._onSubmit(String(city));
  };

  #geoButtonClickHandler = () => {
    this._onGeolocationClick();
  };

  #inputHandler = (evt) => {
    this._onInput(evt.target.value);
  };

  #suggestionClickHandler = (evt) => {
    this._onSuggestionClick({
      name: evt.currentTarget.dataset.name,
      region: evt.currentTarget.dataset.region,
      country: evt.currentTarget.dataset.country,
      latitude: evt.currentTarget.dataset.latitude,
      longitude: evt.currentTarget.dataset.longitude,
    });
  };
}
