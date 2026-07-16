import AbstractView from './abstract-view.js';

export default class SidebarCityView extends AbstractView {
  constructor(city) {
    super();
    this._city = city;
  }

  get template() {
    return `
      <article class="sidebar-city">
        <p class="sidebar-city__title">${this._city.city}</p>
        <p class="sidebar-city__country">${this._city.country}</p>
      </article>
    `;
  }
}
