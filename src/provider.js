import ModelPoint from './model-point.js';

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

/**
 * Класс отвечает за переключением работы online/offline
 * online - запрос к серверу через api
 * offline - запрос к offline хранилищу
 */
export default class Provider {
  constructor({api, pointStore, offerStore, destStore, generateId}) {
    this._api = api;
    this._pointStore = pointStore;
    this._offerStore = offerStore;
    this._destStore = destStore;
    this._generateId = generateId;
    this._needSync = false;
  }

  updatePoint({id, data}) {
    if (this._isOnline()) {
      return this._api.updatePoint({id, data})
        .then((point) => {
          this._pointStore.setItem({key: point.id, item: point.toRAW()});
          return point;
        });
    } else {
      const point = data;
      this._needSync = true;
      this._pointStore.setItem({key: point.id, item: point});
      return Promise.resolve(ModelPoint.parsePoint(point));
    }
  }

  createPoint({point}) {
    if (this._isOnline()) {
      return this._api.createPoint({point})
        .then((pointCreated) => {
          this._pointStore.setItem({key: pointCreated.id, item: pointCreated});
          return pointCreated;
        });
    } else {
      point.id = this._generateId();
      this._needSync = true;

      this._pointStore.setItem({key: point.id, item: point});
      return Promise.resolve(ModelPoint.parsePoint(point));
    }
  }

  deletePoint({id}) {
    if (this._isOnline()) {
      return this._api.deletePoint({id})
        .then(() => {
          this._pointStore.removeItem({key: id});
        });
    } else {
      this._needSync = true;
      this._pointStore.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          points.map((point) => this._pointStore.setItem({key: point.id, item: point.toRAW()}));
          return points;
        });
    } else {
      const rawPointsMap = this._pointStore.getAll();
      const rawPoints = objectToArray(rawPointsMap);
      const points = rawPoints.map((point) => ModelPoint.parsePoint(point));
      return Promise.resolve(points);
    }
  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          offers.map((offer) => this._offerStore.setItem({key: offer.id, item: offer}));
          return offers;
        });
    } else {
      const rawOffersMap = this._offerStore.getAll();
      const rawOffers = objectToArray(rawOffersMap);
      const offers = ModelPoint.parsePoint(rawOffers);

      return Promise.resolve(offers);
    }
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          destinations.map((dest) => this._destStore.setItem({key: dest.id, item: dest}));
          return destinations;
        });
    } else {
      const rawDestinationsMap = this._destStore.getAll();
      const rawDestinations = objectToArray(rawDestinationsMap);
      const destinations = ModelPoint.parsePoint(rawDestinations);

      return Promise.resolve(destinations);
    }
  }

  syncPoints() {
    return this._api.syncPoints({points: objectToArray(this._pointStore.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
