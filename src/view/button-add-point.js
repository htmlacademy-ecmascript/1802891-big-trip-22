import AbstractView from '../framework/view/abstract-view';

function addPointButtonTemplate(mode) {
  return `
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${mode === 'OPEN' ? 'disabled' : ''}>
    New event
  </button>
  `;
}

export default class ButtonAddPointView extends AbstractView{
  #handlerOpenPointClick = null;
  #modeAddPoint = null;

  constructor(onButtonClick, modeAddPoint) {
    super();
    this.#handlerOpenPointClick = onButtonClick;
    this.element.addEventListener('click', this.#clickButton);
    this.#modeAddPoint = modeAddPoint;
  }

  get template() {
    return addPointButtonTemplate(this.#modeAddPoint);
  }

  #clickButton = (evt) => {
    evt.preventDefault();
    this.#handlerOpenPointClick();
  };
}
