import AbstractView from '../framework/view/abstract-view.js';
import { sortPointsByDay } from '../utils/point.js';
import { CountPoint } from '../const.js';

function createTitle(pointModel) {
  let textTitle = '';
  const points = [...pointModel.points];
  const pointsLength = points.length;
  points.sort(sortPointsByDay);

  let oneSelectDestination = null;
  let twoSelectDestination = null;
  let threeSelectDestination = null;
  let endSelectDestination = null;

  if (pointModel.points.length !== 0) {
    oneSelectDestination = pointModel.destinations.find((point) => points[0]?.destinationId === point.id);
    twoSelectDestination = pointModel.destinations.find((point) => points[1]?.destinationId === point.id);
    threeSelectDestination = pointModel.destinations.find((point) => points[2]?.destinationId === point.id);
    endSelectDestination = pointModel.destinations.find((point) => points[points.length - 1]?.destinationId === point.id);
  }

  switch(pointsLength) {
    case CountPoint.ZERO:
      textTitle = '';
      break;
    case CountPoint.THREE:
      textTitle = `${oneSelectDestination?.name} &mdash; ${twoSelectDestination?.name} &mdash; ${threeSelectDestination?.name}`;
      break;
    case CountPoint.TWO:
      textTitle = `${oneSelectDestination?.name} &mdash; ${twoSelectDestination?.name}`;
      break;
    case CountPoint.ONE:
      textTitle = `${oneSelectDestination?.name}`;
      break;
    default:
      textTitle = `${oneSelectDestination?.name} &mdash;...&mdash; ${endSelectDestination?.name}`;
  }

  return `
    <h1 class="trip-info__title">${textTitle}</h1>
  `;
}

export default class InfoTitleView extends AbstractView{
  #pointModel = null;
  constructor(pointModel) {
    super();
    this.#pointModel = pointModel;
  }

  get template() {
    return createTitle(this.#pointModel);
  }
}
