import AbstractView from './abstract-view.js';

export default class WeatherSectionView extends AbstractView {
  get template() {
    return `
      <section class="card section-card">
        <h2 class="section-card__title">Погода сейчас</h2>
        <div class="section-card__content"></div>
      </section>
    `;
  }

  get contentElement() {
    return this.element.querySelector('.section-card__content');
  }
}
