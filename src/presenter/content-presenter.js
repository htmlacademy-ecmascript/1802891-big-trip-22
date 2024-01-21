import TripEvensListView from '../view/trip-list.js';
import SortPointView from '../view/sort-point.js';
import NoPointView from '../view/list-point-empty.js';
import PointPresenter from './point-presenter.js';
import { sortPointByTime, sortPointByPrice } from '../utils/point.js';
import { SORT_TYPE, UpdateType, UserAction } from '../const.js';
import { remove, render } from '../framework/render.js';
import { updateDataItem } from '../utils/common.js';
import HeaderPresenter from './header-presenter.js';

export default class contentPresenter {
  #tripList = new TripEvensListView();
  #noPointComponent = new NoPointView();
  #pointPresenter = null;
  #headerPresenter = null;
  #sortPointView = null;

  #contentContainer = null;
  #pointModel = null;
  #currentTypeSort = SORT_TYPE.DAY;

  #pointPresenters = new Map();

  constructor({contentContainer, pointModel }) {
    this.#contentContainer = contentContainer;
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentTypeSort) {
      case `${SORT_TYPE.TIME}`:
        return [...this.#pointModel.points.sort(sortPointByTime)];
      case `${SORT_TYPE.PRICE}`:
        return [...this.#pointModel.points.sort(sortPointByPrice)];
    }

    return this.#pointModel.points;
  }

  init() {
    this.#renderHeader();
    this.#renderContents();
  }

  #renderNoPoint() {
    render(this.#noPointComponent, this.#contentContainer);
  }

  #renderContents() {
    if (this.#pointModel.points.length === 0) {
      this.#renderNoPoint();
      return;
    }

    this.#renderSortPoints();
    render(this.#tripList, this.#contentContainer);
    this.#renderPoints(this.points);
  }

  #renderHeader() {
    this.#headerPresenter = new HeaderPresenter(this.#handlerOpenAddPoint);
    this.#headerPresenter.init();
  }


  #renderPoints(tasks) {
    for (const dataPoint of tasks) {
      this.#pointPresenter = new PointPresenter(this.#tripList.element, this.#pointModel, this.#handleViewAction, this.#handlerModeChange);
      this.#pointPresenter.init(dataPoint);

      this.#pointPresenters.set(dataPoint.id, this.#pointPresenter);
    }
  }

  #renderSortPoints() {
    this.#sortPointView = new SortPointView(
      this.#handlerSortTypePoints
    );

    render(this.#sortPointView, this.#contentContainer);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoints(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoints(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init();
        break;
      case UpdateType.MINOR:
        // - обновление списка
        break;
      case UpdateType.MAJOR:
        // - обновить все содержимое
        break;
    }
  };

  #clearContent({resetSortType} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy);
    this.#pointPresenters.clear();

    remove(this.#sortPointView);
    remove(this.#noPointComponent);

  }

  #handlerPointChange = (updatePoint) => {
    const dataPoint = this.#pointModel.points;
    this.#pointModel.point = updateDataItem(dataPoint, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #handlerModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlerSortTypePoints = (sortType) => {
    if (this.#currentTypeSort === sortType) {
      return;
    }
    this.#clearPoints();
    this.#currentTypeSort = sortType;
    this.#renderPoints(this.points);
  };

  #handlerOpenAddPoint = () => {
    this.#pointPresenter.renderPointAdd();
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };


}
