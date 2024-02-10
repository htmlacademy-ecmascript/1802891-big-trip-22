import AbstractView from '../framework/view/abstract-view.js';

function createPrice(pointModel) {
  const points = pointModel.points;
  let totalPrice = 0;

  for (let point of points) {
    totalPrice += point.price;
  }

  return `
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  `;
}

export default class InfoPriceView extends AbstractView{
  #pointModel = null;
  constructor(pointModel) {
    super();
    this.#pointModel = pointModel;
  }

  get template() {
    return createPrice(this.#pointModel);
  }
}
