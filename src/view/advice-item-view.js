import AbstractView from './abstract-view.js';

export default class AdviceItemView extends AbstractView {
  constructor(adviceItem) {
    super();
    this._adviceItem = adviceItem;
  }

  get template() {
    return `
      <article class="advice-item">
        <p class="advice-item__title">${this._adviceItem.title}</p>
        <p class="advice-item__text">${this._adviceItem.text}</p>
      </article>
    `;
  }
}
