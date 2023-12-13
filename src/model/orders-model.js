import { getRandomOrder } from '../mock/route.js';

const ORDER_COUNT = 3;

export default class OrderModel {
  orders = Array.from({length: ORDER_COUNT}, getRandomOrder);

  getOrders() {
    return this.orders;
  }
}
