import AbstractView from './abstract-view.js';

export default class SimpleMessageView extends AbstractView {
  constructor(title, text) {
    super();
    this._title = title;
    this._text = text;
  }

  get template() {
    return `
      <article class="sidebar-city">
        <p class="sidebar-city__title">${this._title}</p>
        <p class="sidebar-city__country">${this._text}</p>
      </article>
    `;
  }
}
