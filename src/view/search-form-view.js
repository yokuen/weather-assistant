import AbstractView from './abstract-view.js';

export default class SearchFormView extends AbstractView {
  constructor(onSubmit, { message = '', city = '', isLoading = false } = {}) {
    super();
    this._onSubmit = onSubmit;
    this._message = message;
    this._city = city;
    this._isLoading = isLoading;

    this._formElement = this.element.querySelector('.search-panel__form');
    this._inputElement = this.element.querySelector('.search-panel__input');
    this._statusElement = this.element.querySelector('.search-panel__status');

    this._inputElement.value = this._city;
    this._statusElement.textContent = this._message;
    this._formElement.addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return `
      <section class="search-panel__inner" aria-busy="${this._isLoading}">
        <h1 class="search-panel__title">Найдите город</h1>
        <p class="search-panel__text">Введите название города чтобы увидеть прогноз погоды</p>

        <form class="search-panel__form">
          <label class="visually-hidden" for="city-search">Название города</label>
          <input
            class="search-panel__input"
            id="city-search"
            name="city"
            type="text"
            placeholder="Например, Екатеринбург"
            autocomplete="off"
            required
            ${this._isLoading ? 'disabled' : ''}
          />
          <button
            class="search-panel__button"
            type="submit"
            ${this._isLoading ? 'disabled' : ''}
          >
            ${this._isLoading ? 'Загрузка...' : 'Показать погоду'}
          </button>
        </form>

        <p class="search-panel__status" aria-live="polite"></p>
      </section>
    `;
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    const formData = new FormData(this._formElement);
    const city = formData.get('city') ?? '';

    this._onSubmit(String(city));
  };
}
