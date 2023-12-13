import Order from '../view/order.js';
import TripEvensList from '../view/events-list.js';
import SortContentView from '../view/sort-content.js';
import AddOrder from '../view/add-order.js';
import EditEvent from '../view/edit-order.js';
import {render, RenderPosition} from '../render.js';

const tripContent = document.querySelector('.trip-events');
const QUANTITY_EVENT = 3;

export default class BoardPresenter {
  tripEvensList = new TripEvensList();

  constructor({contentContainer, orderModel}) {
    this.contentContainer = contentContainer;
    this.orderModel = orderModel;
  }


  init() {
    this.contentOrder = [...this.orderModel.getOrders()];
    render(new SortContentView(), tripContent);
    render(this.tripEvensList, this.contentContainer);

    for (let i = 0; i < QUANTITY_EVENT; i++){
      render(new Order({order: this.contentOrder[i]}), this.tripEvensList.getElement());
    }
    render(new AddOrder({order: this.contentOrder[1]}), this.tripEvensList.getElement(), RenderPosition.AFTERBEGIN);
    render(new EditEvent({order: this.contentOrder[1]}), this.tripEvensList.getElement());
  }

}
