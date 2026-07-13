import AbstractView from './abstract-view.js';

export default class SimpleSidebarView extends AbstractView {
  constructor(title, placeholderTitle) {
    super();
    this._title = title;
    this._placeholderTitle = placeholderTitle;
  }

  get template() {
    return `
      <section class="card side-card">
        <h2 class="section-card__title">${this._title}</h2>
        <div class="placeholder">
          <p class="placeholder__title">${this._placeholderTitle}</p>
        </div>
      </section>
    `;
  }
}
