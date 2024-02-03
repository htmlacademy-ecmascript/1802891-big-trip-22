import ApiService from './framework/api-service';

const Method = {
  GET: 'get',
  PUT: 'put'
};

export default class PointApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToClient(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToClient(point) {
    const adaptedToClient = {...point,
      'base_price': point.price,
      'date_from': point.startDate instanceof Date ? point.startDate.toISOString() : null,
      'date_to': point.endDate instanceof Date ? point.endDate.toISOString() : null,
      'type' : point.typePoint,
      'is_favorite': point.isFavourite,
      'destination': point.destinationId,
    };

    delete adaptedToClient.price;
    delete adaptedToClient.startDate;
    delete adaptedToClient.endDate;
    delete adaptedToClient.typePoint;
    delete adaptedToClient.isFavourite;
    delete adaptedToClient.destinationId;

    return adaptedToClient;
  }
}

