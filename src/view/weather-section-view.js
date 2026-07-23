import AbstractView from './abstract-view.js';

export default class WeatherSectionView extends AbstractView {
  constructor(title = 'Погода сейчас') {
    super();
    this._title = title;
  }

  get template() {
    return `
      <section class="card section-card">
        <h2 class="section-card__title">${this._title}</h2>
        <div class="section-card__content"></div>
      </section>
    `;
  }

  get contentElement() {
    return this.element.querySelector('.section-card__content');
  }
}
