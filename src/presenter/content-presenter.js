import TripEvensListView from '../view/trip-list.js';
import SortPointView from '../view/sort-point.js';
import NoPointView from '../view/list-point-empty.js';
import PointPresenter from './point-presenter.js';
import { sortPointByTime, sortPointByPrice } from '../utils/point.js';
import { SORT_TYPE, UpdateType, UserAction } from '../const.js';
import { remove, render } from '../framework/render.js';
import HeaderPresenter from './header-presenter.js';
import { RenderPosition } from '../framework/render.js';

const ModeAddPoint = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

const filters = [
  {
    type: 'everyThing',
  }
];

export default class contentPresenter {
  #tripList = new TripEvensListView();
  #noPointComponent = new NoPointView();
  #pointPresenter = null;
  #headerPresenter = null;
  #sortPointView = null;

  #contentContainer = null;
  #pointModel = null;
  #filterModel = null;
  #modeAddPoint = ModeAddPoint.CLOSE;
  #currentTypeSort = SORT_TYPE.DAY;

  #pointPresenters = new Map();

  constructor({contentContainer, pointModel, filterModel }) {
    this.#contentContainer = contentContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

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

  #renderHeader(modeAddPoint) {
    this.#headerPresenter = new HeaderPresenter({
      handlerOpenAddPoint:this.#handlerOpenAddPoint,
      modeAddPoint: modeAddPoint,
      filtersModel: this.#filterModel,
      pointModel: this.#pointModel,
      // filters: filters,
      // currentFilterType: 'everyThing',
      // onFilterTypeChange: () => {}
    });
    this.#headerPresenter.init();
    this.#headerPresenter.initFilters();
  }


  #renderPoints(tasks) {
    for (const dataPoint of tasks) {
      this.#pointPresenter = new PointPresenter(this.#tripList.element, this.#pointModel, this.#handleViewAction, this.#handlerModeChange, this.#modeAddPoint);
      this.#pointPresenter.init(dataPoint);

      this.#pointPresenters.set(dataPoint.id, this.#pointPresenter);
    }
  }

  #renderSortPoints() {
    this.#sortPointView = new SortPointView(
      this.#handlerSortTypePoints,
      this.#currentTypeSort,
    );

    render(this.#sortPointView, this.#contentContainer, RenderPosition.AFTERBEGIN);
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
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearContent();
        this.#renderContents();
        break;
      case UpdateType.MAJOR:
        this.#clearContent();
        this.#renderContents({resetSortType: true});
        break;
    }
  };

  #clearContent({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortPointView);
    remove(this.#noPointComponent);

    if (resetSortType) {
      this.#currentTypeSort = SORT_TYPE.DAY;
    }
  }

  #handlerModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlerSortTypePoints = (sortType) => {
    if (this.#currentTypeSort === sortType) {
      return;
    }
    this.#clearContent();
    this.#currentTypeSort = sortType;
    this.#renderPoints(this.points);
    this.#renderSortPoints();
  };

  #handlerOpenAddPoint = () => {
    this.#handlerModeChange();
    this.#modeAddPoint = ModeAddPoint.OPEN;
    this.#pointPresenter.renderPointAdd();
    // remove(this.#headerPresenter);
    // this.#renderHeader(this.#modeAddPoint);
  };
}
