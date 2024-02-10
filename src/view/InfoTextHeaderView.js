import AbstractView from '../framework/view/abstract-view.js';
import { humanizeOrderData } from '../utils/date.js';
import { FormatTime } from '../const.js';

function createData(pointModel) {
  const pointsLength = pointModel.points.length;
  const startDate = pointsLength !== 0 ? humanizeOrderData(pointModel.points[0].startDate, FormatTime.TIME_FORMAT_MMM_DD) : '';
  const endDate = pointsLength !== 0 ? humanizeOrderData(pointModel.points[pointsLength - 1].endDate, FormatTime.TIME_FORMAT_MMM_DD) : '';
  return `
    <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>
  `;
}

export default class InfoTextView extends AbstractView{
  #pointModel = null;
  constructor(pointModel) {
    super();
    this.#pointModel = pointModel;
  }

  get template() {
    return createData(this.#pointModel);
  }
}
