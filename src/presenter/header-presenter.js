import FilterView from '../view/filter-main.js';
import InfoDataView from '../view/info-data-header.js';
import InfoTitleView from '../view/info-title-header.js';
import InfoPriceView from '../view/info-price-header.js';
import InfoContainerView from '../view/info-container.js';
import InfoWrapperContentView from '../view/info-wrapper-content.js';
import ButtonAddPointView from '../view/button-add-point.js';


import {render, RenderPosition} from '../framework/render.js';

export default class HeaderPresenter {
  #tripContainer = new InfoContainerView();
  #tripWrapperContent = new InfoWrapperContentView();


  #handlerOpenPointClick = null;
  #handlerClosePointClick = null;

  #headerContainer = null;
  #containerFilters = null;

  constructor(onOpenPointClick, onClosePointClick) {
    this.#handlerOpenPointClick = onOpenPointClick;
    this.#handlerClosePointClick = onClosePointClick;
  }

  init() {
    this.#headerContainer = document.querySelector('.trip-main');
    this.#containerFilters = document.querySelector('.trip-controls__filters');

    render(this.#tripContainer, this.#headerContainer, RenderPosition.AFTERBEGIN);
    render(new InfoPriceView(), this.#tripContainer.element);
    render(this.#tripWrapperContent, this.#tripContainer.element, RenderPosition.AFTERBEGIN);
    render(new InfoTitleView(), this.#tripWrapperContent.element);
    render(new InfoDataView(), this.#tripWrapperContent.element);
    render(new FilterView(), this.#containerFilters);
    render(new ButtonAddPointView(this.#handlerOpenPointClick), this.#headerContainer);
  }
}
