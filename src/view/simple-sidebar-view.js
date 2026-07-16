import AbstractView from './abstract-view.js';

export default class SimpleSidebarView extends AbstractView {
  constructor(title) {
    super();
    this._title = title;
  }

  get template() {
    return `
      <section class="card side-card">
        <h2 class="section-card__title">${this._title}</h2>
        <div class="sidebar-list"></div>
      </section>
    `;
  }

  get contentElement() {
    return this.element.querySelector('.sidebar-list');
  }
}
