import AbstractView from './abstract-view.js';

export default class SimpleMessageView extends AbstractView {
  constructor(title, text) {
    super();
    this._title = title;
    this._text = text;
  }

  get template() {
    return `
      <article class="simple-message">
        <h3 class="simple-message__title">${this._title}</h3>
        <p class="simple-message__text">${this._text}</p>
      </article>
    `;
  }
}
