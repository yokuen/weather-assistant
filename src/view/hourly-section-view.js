import AbstractView from './abstract-view.js';

export default class HourlySectionView extends AbstractView {
  get template() {
    return `
      <section class="card section-card">
        <h2 class="section-card__title">Почасовой прогноз</h2>
        <div class="hourly-list"></div>
      </section>
    `;
  }

  get contentElement() {
    return this.element.querySelector('.hourly-list');
  }
}
