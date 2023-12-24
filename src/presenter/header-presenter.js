import FilterView from '../view/filter-main.js';
import InfoDataView from '../view/info-data-header.js';
import InfoTitleView from '../view/info-title-header.js';
import InfoPriceView from '../view/info-price-header.js';
import InfoContainerView from '../view/info-container.js';
import InfoWrapperContentView from '../view/info-wrapper-content.js';
import ButtonAddPointView from '../view/button-add-point.js';

import {render, RenderPosition} from '../framework/render.js';

export default class InfoPresenter {
  #tripContainer = new InfoContainerView();
  #tripWrapperContent = new InfoWrapperContentView();

  #headerContainer = null;
  #containerFilters = null;

  constructor({headerContainer, containerFilters}) {
    this.#headerContainer = headerContainer;
    this.#containerFilters = containerFilters;

  }

  init() {
    render(this.#tripContainer, this.#headerContainer, RenderPosition.AFTERBEGIN);
    render(new InfoPriceView(), this.#tripContainer.element);
    render(this.#tripWrapperContent, this.#tripContainer.element, RenderPosition.AFTERBEGIN);
    render(new InfoTitleView(), this.#tripWrapperContent.element);
    render(new InfoDataView(), this.#tripWrapperContent.element);
    render(new FilterView(), this.#containerFilters);
    render(new ButtonAddPointView, this.#headerContainer);
  }
}
