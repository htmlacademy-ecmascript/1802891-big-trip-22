import AbstractView from '../framework/view/abstract-view.js';

function createData() {
  return `
    <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
  `;
}

export default class InfoTextView extends AbstractView{
  get template() {
    return createData();
  }
}
