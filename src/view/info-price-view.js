import AbstractView from '../framework/view/abstract-view.js';
import { sortPointsByDay } from '../utils/point.js';

function createPrice(pointModel) {
  const points = [...pointModel.points];
  points.sort(sortPointsByDay);
  let totalPrice = 0;

  for (const point of points) {
    totalPrice += point.price;
  }

  return `
    <p class="trip-info__cost">
      ${points.length !== 0 ? `Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>` : ''}
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
