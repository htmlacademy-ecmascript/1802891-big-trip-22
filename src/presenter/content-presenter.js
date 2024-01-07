import TripEvensListView from '../view/trip-list.js';
import SortPointView from '../view/sort-point.js';
import NoPointView from '../view/list-point-empty.js';
import PointPresenter from './point-presenter.js';
import { sortPointByTime, sortPointByPrice } from '../utils/point.js';
import { SORT_TYPE } from '../const.js';
import { render } from '../framework/render.js';
import { updateDataItem } from '../utils/common.js';
import HeaderPresenter from './header-presenter.js';

export default class contentPresenter {
  #tripList = new TripEvensListView();
  #noPointComponent = new NoPointView();
  #sortPointView = null;

  #contentContainer = null;
  #pointModel = null;
  #headerPresenter = null;
  #dataPoints = [];
  #sourcedDataPoints = [];
  #currentTypeSort = SORT_TYPE.DAY;

  #pointPresenters = new Map();

  constructor({contentContainer, pointModel }) {
    this.#contentContainer = contentContainer;
    this.#pointModel = pointModel;
  }

  init() {
    this.#dataPoints = [...this.#pointModel.points];
    this.#sourcedDataPoints = [...this.#pointModel.points];
    this.#renderHeader();
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

    this.#renderSortPoints();
    render(this.#tripList, this.#contentContainer);
    this.#renderPoints();
  }

  #renderHeader() {
    const headerPresenter = new HeaderPresenter(this.#pointModel);
    headerPresenter.init(this.#dataPoints[0]);
  }


  #renderPoints() {
    for (const dataPoint of this.#dataPoints) {
      const pointPresenter = new PointPresenter(this.#tripList.element, this.#pointModel, this.#handlerPointChange, this.#handlerModeChange);
      pointPresenter.init(dataPoint);

      this.#pointPresenters.set(dataPoint.id, pointPresenter);
    }
  }

  #renderSortPoints() {
    this.#sortPointView = new SortPointView(
      this.#handlerSortTypePoints
    );

    render(this.#sortPointView, this.#contentContainer);
  }

  #handlerPointChange = (updatePoint) => {
    this.#dataPoints = updateDataItem(this.#dataPoints, updatePoint);
    this.#sourcedDataPoints = updateDataItem(this.#sourcedDataPoints, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #handlerModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #sortPoint(sortType) {
    switch (sortType) {
      case `${SORT_TYPE.TIME}`:
        this.#dataPoints.sort(sortPointByTime);
        break;
      case `${SORT_TYPE.PRICE}`:
        this.#dataPoints.sort(sortPointByPrice);
        break;
      case `${SORT_TYPE.DAY}`:
        this.#dataPoints = [...this.#sourcedDataPoints];
        break;
    }

    this.#currentTypeSort = sortType;
  }

  #handlerSortTypePoints = (sortType) => {
    if (this.#currentTypeSort === sortType) {
      return;
    }
    this.#sortPoint(sortType);
    this.#clearPoints();
    this.#renderPoints();
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };


}
