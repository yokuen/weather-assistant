import AbstractView from './abstract-view.js';

export default class WeatherSectionView extends AbstractView {
  get template() {
    return `
      <section class="card section-card">
        <h2 class="section-card__title">Погода сейчас</h2>
        <div class="placeholder placeholder--large">
          <p class="placeholder__title">Текущая погода</p>
        </div>
      </section>
    `;
  }
}
