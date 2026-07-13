import AbstractView from './abstract-view.js';

export default class SearchFormView extends AbstractView {
  get template() {
    return `
      <section class="search-panel__inner">
        <h1 class="search-panel__title">Найдите город</h1>

        <div class="search-panel__form">
          <input
            class="search-panel__input"
            type="text"
            placeholder="Например, Екатеринбург"
            disabled
          />
          <button class="search-panel__button" type="button" disabled>
            Показать погоду
          </button>
        </div>
      </section>
    `;
  }
}
