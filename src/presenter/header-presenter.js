import FilterView from '../view/filter-main.js';
import InfoDataView from '../view/info-data-header.js';
import InfoTitleView from '../view/info-title-header.js';
import InfoPriceView from '../view/info-price-header.js';
import InfoContainerView from '../view/info-container.js';
import InfoWrapperContentView from '../view/info-wrapper-content.js';
import ButtonAddPointView from '../view/button-add-point.js';
import AddPointView from '../view/add-point.js';

import {render, RenderPosition} from '../framework/render.js';

export default class HeaderPresenter {
  #tripContainer = new InfoContainerView();
  #tripWrapperContent = new InfoWrapperContentView();
  #addPointView = null;

  #pointModel = null;
  #headerContainer = null;
  #containerFilters = null;

  constructor(pointModel) {
    this.#pointModel = pointModel;
  }

  init(point) {
    this.#containerFilters = document.querySelector('.trip-controls__filters');
    this.#headerContainer = document.querySelector('.trip-main');

    render(this.#tripContainer, this.#headerContainer, RenderPosition.AFTERBEGIN);
    render(new InfoPriceView(), this.#tripContainer.element);
    render(this.#tripWrapperContent, this.#tripContainer.element, RenderPosition.AFTERBEGIN);
    render(new InfoTitleView(), this.#tripWrapperContent.element);
    render(new InfoDataView(), this.#tripWrapperContent.element);
    render(new FilterView(), this.#containerFilters);
    render(new ButtonAddPointView, this.#headerContainer);

    this.#addPointView = new AddPointView({
      point: point,
      offers: [...this.#pointModel.offers],
      destinations: this.#pointModel.destinations,
      //onFormSubmit: this.#handlerFormSubmit,
    });
  }

  #handlerOpenAddPointClick = (addView) => {
    //render(this.#addPointView);
  };
}
