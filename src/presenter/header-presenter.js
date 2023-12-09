import InfoData from '../view/info-data-header.js';
import InfoTitle from '../view/info-title-header.js';
import InfoPrice from '../view/info-price-header.js';
import InfoContainer from '../view/info-container.js';
import InfoWrapperContent from '../view/info-wrapper-content.js';
import {render, RenderPosition} from '../render.js';

export default class InfoPresenter {
  tripContainer = new InfoContainer();
  tripWrapperContent = new InfoWrapperContent();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(this.tripContainer, this.boardContainer, RenderPosition.AFTERBEGIN);
    render(new InfoPrice(), this.tripContainer.getElement());
    render(this.tripWrapperContent, this.tripContainer.getElement(), RenderPosition.AFTERBEGIN);
    render(new InfoTitle(), this.tripWrapperContent.getElement());
    render(new InfoData(), this.tripWrapperContent.getElement());
  }
}
