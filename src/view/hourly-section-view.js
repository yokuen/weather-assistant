import AbstractView from './abstract-view.js';

export default class HourlySectionView extends AbstractView {
  constructor(subtitle = 'Ближайшие часы на сегодня') {
    super();
    this._subtitle = subtitle;
  }

  get template() {
    return `
      <section class="card section-card">
        <div class="hourly-section__header">
          <h2 class="section-card__title">Почасовой прогноз</h2>
          <p class="hourly-section__subtitle">${this._subtitle}</p>
        </div>
        <div class="hourly-scroller"></div>
      </section>
    `;
  }

  get contentElement() {
    return this.element.querySelector('.hourly-scroller');
  }
}
