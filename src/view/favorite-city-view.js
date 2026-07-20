import AbstractView from './abstract-view.js';

export default class FavoriteCityView extends AbstractView {
  constructor(city, onSearch, onRemove) {
    super();
    this._city = city;
    this._onSearch = onSearch;
    this._onRemove = onRemove;

    this.element.querySelector('.favorite-city__open')
      .addEventListener('click', this.#openClickHandler);
    this.element.querySelector('.favorite-city__remove')
      .addEventListener('click', this.#removeClickHandler);
  }

  get template() {
    return `
      <article class="favorite-city">
        <button class="favorite-city__open" type="button">
          <span class="favorite-city__title">${this._city.city}</span>
          <span class="favorite-city__country">${this._city.country}</span>
        </button>

        <button class="favorite-city__remove" type="button">Удалить</button>
      </article>
    `;
  }

  #openClickHandler = () => {
    this._onSearch(this._city);
  };

  #removeClickHandler = () => {
    this._onRemove(this._city);
  };
}
