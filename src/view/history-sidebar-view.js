import AbstractView from './abstract-view.js';

export default class HistorySidebarView extends AbstractView {
  constructor(onClear) {
    super();
    this._onClear = onClear;

    this.element.querySelector('.history-card__clear')
      .addEventListener('click', this.#clearClickHandler);
  }

  get template() {
    return `
      <section class="card side-card">
        <h2 class="section-card__title">История поиска</h2>
        <div class="sidebar-list"></div>
        <button class="history-card__clear" type="button">Очистить</button>
      </section>
    `;
  }

  get contentElement() {
    return this.element.querySelector('.sidebar-list');
  }

  #clearClickHandler = () => {
    this._onClear();
  };
}
