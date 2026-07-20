import AbstractView from './abstract-view.js';

export default class AdviceSectionView extends AbstractView {
  get template() {
    return `
      <section class="card section-card">
        <h2 class="section-card__title">Советы на день</h2>
        <div class="advice-list"></div>
      </section>
    `;
  }

  get contentElement() {
    return this.element.querySelector('.advice-list');
  }
}
