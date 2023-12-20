import FilterView from '../view/filter-main.js';
import InfoData from '../view/info-data-header.js';
import InfoTitle from '../view/info-title-header.js';
import InfoPrice from '../view/info-price-header.js';
import InfoContainer from '../view/info-container.js';
import InfoWrapperContent from '../view/info-wrapper-content.js';
import {render, RenderPosition} from '../framework/render.js';

export default class InfoPresenter {
  tripContainer = new InfoContainer();
  tripWrapperContent = new InfoWrapperContent();

  constructor({headerContainer, containerFilters}) {
    this.boardContainer = headerContainer;
    this.containerFilters = containerFilters;

  }

  init() {
    render(this.tripContainer, this.boardContainer, RenderPosition.AFTERBEGIN);
    render(new InfoPrice(), this.tripContainer.element);
    render(this.tripWrapperContent, this.tripContainer.element, RenderPosition.AFTERBEGIN);
    render(new InfoTitle(), this.tripWrapperContent.element);
    render(new InfoData(), this.tripWrapperContent.element);
    render(new FilterView(), this.containerFilters);
  }
}
