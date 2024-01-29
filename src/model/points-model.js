import { getRandomPoint } from '../mock/route.js';
import { POINT_COUNT } from '../const.js';
import { mockOffers } from '../mock/offers.js';
import { mockDestinations } from '../mock/destinations.js';

export default class PointModel {
  #orders = Array.from({length: POINT_COUNT}, getRandomPoint);
  #offers = mockOffers;
  #destinations = mockDestinations;

  get points() {
    return this.#orders;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  getOfferByType(type) {
    const allOffers = this.#offers;
    return allOffers.find((offer) => offer.type === type);
  }

  getOfferById(type, pointId) {
    const offersType = this.getOfferByType(type);
    return offersType.offers.filter((item) => pointId.find((id) => item.id === id));
  }

  getDestinationsById(id) {
    const allDestinations = this.#destinations;
    return allDestinations.find((item) => item.id === id);
  }
}
