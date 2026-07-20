import AbstractView from './abstract-view.js';

export default class HistoryCityView extends AbstractView {
  constructor(city, onSearch) {
    super();
    this._city = city;
    this._onSearch = onSearch;

    this.element.addEventListener('click', this.#itemClickHandler);
  }

  get template() {
    return `
      <button class="history-city" type="button">
        <span class="history-city__title">${this._city.city}</span>
        <span class="history-city__country">${this._city.country}</span>
      </button>
    `;
  }

  #itemClickHandler = () => {
    this._onSearch(this._city);
  };
}
