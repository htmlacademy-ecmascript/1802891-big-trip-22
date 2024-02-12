import AbstractView from '../framework/view/abstract-view';

function addPointButtonTemplate(isErrorServer) {
  return `
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${isErrorServer ? 'disabled' : ''}>
    New event
  </button>
  `;
}

export default class ButtonAddPointView extends AbstractView{
  #handlerOpenPointClick = null;
  #isErrorServer = null;

  constructor(onButtonClick, isErrorServer) {
    super();
    this.#handlerOpenPointClick = onButtonClick;
    this.#isErrorServer = isErrorServer;
    this.element.addEventListener('click', this.#onCreateNewPointClick);
  }

  get template() {
    return addPointButtonTemplate(this.#isErrorServer);
  }

  #onCreateNewPointClick = (evt) => {
    evt.preventDefault();
    this.#handlerOpenPointClick();
    evt.target.disabled = true;
  };
}
