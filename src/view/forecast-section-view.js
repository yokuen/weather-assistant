import AbstractView from './abstract-view.js';

export default class ForecastSectionView extends AbstractView {
  get template() {
    return `
      <section class="card section-card">
        <h2 class="section-card__title">Прогноз на 3 дня</h2>
        <div class="forecast-grid">
          <article class="placeholder">
            <p class="placeholder__title">День 1</p>
          </article>
          <article class="placeholder">
            <p class="placeholder__title">День 2</p>
          </article>
          <article class="placeholder">
            <p class="placeholder__title">День 3</p>
          </article>
        </div>
      </section>
    `;
  }
}
