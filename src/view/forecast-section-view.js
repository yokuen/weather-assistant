import AbstractView from './abstract-view.js';

export default class ForecastSectionView extends AbstractView {
  get template() {
    return `
      <section class="card section-card">
        <h2 class="section-card__title">Прогноз на 3 дня</h2>
        <div class="forecast-grid section-card__content"></div>
      </section>
    `;
  }

  get contentElement() {
    return this.element.querySelector('.section-card__content');
  }
}
