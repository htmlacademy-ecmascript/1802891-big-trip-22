import FilterView from '../view/trip-filter-view.js';
import InfoDataView from '../view/info-day-view.js';
import InfoTitleView from '../view/info-title-view.js';
import InfoPriceView from '../view/info-price-view.js';
import InfoContainerView from '../view/info-container-view.js';
import InfoWrapperContentView from '../view/info-wrapper-content-view.js';
import ButtonAddPointView from '../view/button-add-point-view.js';
import { FilterType, UpdateType } from '../const.js';
import { filter } from '../utils/filter.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';

export default class HeaderPresenter {
  #tripContainer = new InfoContainerView();
  #tripWrapperContent = new InfoWrapperContentView();
  #infoPriceView = null;
  #infoTitleView = null;
  #infoDataView = null;
  #buttonAddPointView = null;


  #handlerOpenPointClick = null;
  #filtersModel = null;
  #pointModel = null;
  #pointsTimesLength = [];
  #currentFilterType = null;

  #headerContainer = null;
  #containerFilters = null;
  #filterComponent = null;

  constructor({handlerOpenAddPoint, filtersModel, pointModel}) {
    this.#handlerOpenPointClick = handlerOpenAddPoint;
    this.#filtersModel = filtersModel;
    this.#pointModel = pointModel;
    this.#pointModel.addObserver(this.#handelModeEvent);
    this.#filtersModel.addObserver(this.#handelModeEvent);
  }

  get filters() {
    return Object.values(FilterType).map((type) => type);
  }

  init() {
    this.#headerContainer = document.querySelector('.trip-main');
    this.#containerFilters = document.querySelector('.trip-controls__filters');

    this.#infoDataView = new InfoDataView(this.#pointModel);
    this.#infoPriceView = new InfoPriceView(this.#pointModel);
    this.#infoTitleView = new InfoTitleView(this.#pointModel);
    this.#buttonAddPointView = new ButtonAddPointView(this.#handlerOpenPointClick, this.#pointModel.isErrorServer);

    render(this.#tripContainer, this.#headerContainer, RenderPosition.AFTERBEGIN);
    render(this.#infoPriceView, this.#tripContainer.element);
    render(this.#tripWrapperContent, this.#tripContainer.element, RenderPosition.AFTERBEGIN);
    render(this.#infoTitleView, this.#tripWrapperContent.element);
    render(this.#infoDataView , this.#tripWrapperContent.element);
    render(this.#buttonAddPointView, this.#headerContainer);
  }

  initFilters() {
    const filters = this.filters;
    const points = this.#pointModel.points;
    const prevFilterComponent = this.#filterComponent;
    this.#currentFilterType = this.#filtersModel.filter;

    this.#pointsTimesLength = Object.create({}, {
      [FilterType.EVERYTHING]: {
        value: (filter[FilterType.EVERYTHING](points)).length
      },
      [FilterType.FUTURE]: {
        value: (filter[FilterType.FUTURE](points)).length
      },
      [FilterType.PRESENT]: {
        value: (filter[FilterType.PRESENT](points)).length
      },
      [FilterType.PAST]: {
        value: (filter[FilterType.PAST](points)).length
      }
    });

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#currentFilterType,
      onFilterTypeChange: this.#handlerFilterTypeChange,
      pointsTimesLength: this.#pointsTimesLength,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#containerFilters);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handelModeEvent = () => {
    this.initFilters();
  };

  #handlerFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    if (this.#buttonAddPointView.element.disabled) {
      this.#buttonAddPointView.element.disabled = false;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };

  removeFilters() {
    remove(this.#filterComponent);
    this.#filterComponent = null;
    this.#filtersModel.filter = FilterType.EVERYTHING;
  }

  removeInfoComponents() {
    remove(this.#infoDataView);
    remove(this.#infoTitleView);
    remove(this.#infoPriceView);
  }

  renderInfoComponents() {
    render(this.#infoPriceView, this.#tripContainer.element);
    render(this.#infoTitleView, this.#tripWrapperContent.element);
    render(this.#infoDataView, this.#tripWrapperContent.element);
  }
}


