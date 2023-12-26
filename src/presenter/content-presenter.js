import TripEvensListView from '../view/trip-list.js';
import SortContentView from '../view/sort-content.js';
import NoPoint from '../view/list-point-empty.js';
import RenderPoint from './point-presenter.js';//исправь
import { render } from '../framework/render.js';

export default class contentPresenter {
  #tripList = new TripEvensListView();
  #noPointComponent = new NoPoint();
  #sortContentComponent = new SortContentView();
// тут presenter

  #contentContainer = null;
  #pointModel = null;

  constructor({contentContainer, pointModel}) {
    this.#contentContainer = contentContainer;
    this.#pointModel = pointModel;
  }

  init() {
    this.dataPoints = [...this.#pointModel.points];
    this.#renderBoard();
  }

  #renderNoPoint() {
    render(this.#noPointComponent, this.#contentContainer);
  }

  #renderBoard() {
    if (this.dataPoints.length === 0) {
      this.#renderNoPoint();
      return;
    }

    render(this.#sortContentComponent, this.#contentContainer);
    render(this.#tripList, this.#contentContainer);

    for (const dataPoint of this.dataPoints) {
      const renderPoint = new RenderPoint(this.#tripList.element, this.#pointModel);
      renderPoint.init(dataPoint);
    }
  }
}
