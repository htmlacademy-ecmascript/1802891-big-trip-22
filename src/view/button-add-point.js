import AbstractView from '../framework/view/abstract-view';

function addPointButtonTemplate() {
  return `
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
    New event
  </button>
  `;
}

export default class ButtonAddPointView extends AbstractView{
  #handlerOpenPointClick = null;

  constructor(onButtonClick) {
    super();
    this.#handlerOpenPointClick = onButtonClick;
    this.element.addEventListener('click', this.#clickButton);
  }

  get template() {
    return addPointButtonTemplate();
  }

  #clickButton = (evt) => {
    evt.preventDefault();
    this.#handlerOpenPointClick();
  };
}
