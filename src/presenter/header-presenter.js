import FilterView from '../view/filter-main.js';
import InfoDataView from '../view/info-data-header.js';
import InfoTitleView from '../view/info-title-header.js';
import InfoPriceView from '../view/info-price-header.js';
import InfoContainerView from '../view/info-container.js';
import InfoWrapperContentView from '../view/info-wrapper-content.js';
import ButtonAddPointView from '../view/button-add-point.js';
import { FilterType, UpdateType } from '../const.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';

export default class HeaderPresenter {
  #tripContainer = new InfoContainerView();
  #tripWrapperContent = new InfoWrapperContentView();


  #handlerOpenPointClick = null;
  #filtersModel = null;
  #pointModel = null;

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

    render(this.#tripContainer, this.#headerContainer, RenderPosition.AFTERBEGIN);
    render(new InfoPriceView(), this.#tripContainer.element);
    render(this.#tripWrapperContent, this.#tripContainer.element, RenderPosition.AFTERBEGIN);
    render(new InfoTitleView(), this.#tripWrapperContent.element);
    render(new InfoDataView(), this.#tripWrapperContent.element);
    render(new ButtonAddPointView(this.#handlerOpenPointClick), this.#headerContainer);
  }

  initFilters() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filtersModel.filter,
      onFilterTypeChange: this.#handlerFilterTypeChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#containerFilters);
      return;
    }

    // render(new FilterView(this.#filtersModel, this.#pointModel, this.#onFilterTypeChange), this.#containerFilters);
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

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
