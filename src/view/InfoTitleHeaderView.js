import AbstractView from '../framework/view/abstract-view.js';

function createTitle(pointModel) {
  let textTitle = '';
  const points = pointModel.points;

  if (pointModel.points.length === 0) {
    return;
  }

  const oneSelectDestination = pointModel.destinations.find((point) => points[0].destinationId === point.id);
  const twoSelectDestination = pointModel.destinations.find((point) => points[1].destinationId === point.id);
  const threeSelectDestination = pointModel.destinations.find((point) => points[2].destinationId === point.id);
  const endSelectDestination = pointModel.destinations.find((point) => points[points.length - 1].destinationId === point.id);

  if (points.length <= 3) {
    textTitle = `${oneSelectDestination.name} &mdash; ${twoSelectDestination.name} &mdash; ${threeSelectDestination.name}`;
  }else {
    textTitle = `${oneSelectDestination.name} &mdash;...&mdash; ${endSelectDestination.name}`;
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
