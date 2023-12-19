import Point from '../view/point.js';
import TripEvensList from '../view/events-list.js';
import SortContentView from '../view/sort-content.js';
import AddOrder from '../view/add-point.js';
import EditPoint from '../view/edit-point.js';
import {render, RenderPosition} from '../render.js';

const tripContent = document.querySelector('.trip-events');
const QUANTITY_EVENT = 3;

export default class contentPresenter {
  tripEvensList = new TripEvensList();

  constructor({contentContainer, pointModel}) {
    this.contentContainer = contentContainer;
    this.pointModel = pointModel;
  }


  init() {
    this.contentPoints = [...this.pointModel.getPoints()];
    render(new SortContentView(), tripContent);
    render(this.tripEvensList, this.contentContainer);

    for (let i = 0; i < QUANTITY_EVENT; i++){
      render(new Point({
        point: this.contentPoints[i],
        checkedOffers: [...this.pointModel.getOfferById(this.contentPoints[i].typePoints, this.contentPoints[i].offers)],
        destinations: this.pointModel.getDestinationsById(this.contentPoints[i].destinations)
      }
      ), this.tripEvensList.getElement());
    }

    render(new AddOrder({
      point: this.contentPoints[0],
      checkedOffers: [...this.pointModel.getOfferById(this.contentPoints[0].typePoints, this.contentPoints[0].offers)],
      offers: this.pointModel.getOfferByType(this.contentPoints[0].typePoints),
      destinations: this.pointModel.getDestinationsById(this.contentPoints[0].destinations)
    }), this.tripEvensList.getElement(), RenderPosition.AFTERBEGIN);

    render(new EditPoint({
      point: this.contentPoints[0],
      checkedOffers: [...this.pointModel.getOfferById(this.contentPoints[0].typePoints, this.contentPoints[0].offers)],
      offers: this.pointModel.getOfferByType(this.contentPoints[0].typePoints),
      destinations: this.pointModel.getDestinationsById(this.contentPoints[0].destinations)
    }), this.tripEvensList.getElement());
  }
}
