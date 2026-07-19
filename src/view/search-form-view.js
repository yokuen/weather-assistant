import AbstractView from './abstract-view.js';

export default class SearchFormView extends AbstractView {
  constructor(onSubmit, message = '') {
    super();
    this._onSubmit = onSubmit;
    this._message = message;

    this._formElement = this.element.querySelector('.search-panel__form');
    this._formElement.addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return `
      <section class="search-panel__inner">
        <h1 class="search-panel__title">Найдите город</h1>
        <p class="search-panel__text">
          Введите название города, чтобы увидеть текущую погоду и прогноз на 3 дня.
        </p>

        <form class="search-panel__form">
          <input
            class="search-panel__input"
            name="city"
            type="text"
            placeholder="Например, Екатеринбург"
            autocomplete="off"
          />
          <button class="search-panel__button" type="submit">
            Показать погоду
          </button>
        </form>

        <p class="search-panel__status">${this._message}</p>
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
