import TripEvensListView from '../view/trip-list.js';
import SortContentView from '../view/sort-content.js';
import NoPointView from '../view/list-point-empty.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import { updateDataItem } from '../utils/common.js';

export default class contentPresenter {
  #tripList = new TripEvensListView();
  #noPointComponent = new NoPointView();
  #sortContentComponent = new SortContentView();

  #contentContainer = null;
  #pointModel = null;
  #dataPoints = null;

  #pointPresenters = new Map();

  constructor({contentContainer, pointModel}) {
    this.#contentContainer = contentContainer;
    this.#pointModel = pointModel;
  }

  init() {
    this.#dataPoints = [...this.#pointModel.points];
    this.#renderContents();
  }

  #renderNoPoint() {
    render(this.#noPointComponent, this.#contentContainer);
  }

  #renderContents() {
    if (this.#dataPoints.length === 0) {
      this.#renderNoPoint();
      return;
    }

    render(this.#sortContentComponent, this.#contentContainer);
    render(this.#tripList, this.#contentContainer);
    this.#renderPoints();
  }

  #renderPoints() {
    for (const dataPoint of this.#dataPoints) {
      const pointView = new PointPresenter(this.#tripList.element, this.#pointModel, this.#handlerPointChange, this.#handlerModeChange);
      pointView.init(dataPoint);

      this.#pointPresenters.set(dataPoint.id, pointView);
    }
  }

  #handlerPointChange = (updatePoint) => {
    this.#dataPoints = updateDataItem(this.#dataPoints, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #handlerModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };


  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy);
    this.#pointPresenters.clear();
  }


}
