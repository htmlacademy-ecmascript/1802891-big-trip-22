import AbstractView from '../framework/view/abstract-view';
import { NoTasksTextType } from '../const';

function noPointTemplate({filterType}) {
  const noPointTextValue = NoTasksTextType[filterType];
  return `
    <p class="trip-events__msg">${noPointTextValue}</p>
  `;
}

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return noPointTemplate({filterType: this.#filterType});
  }
}
