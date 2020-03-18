import ModelPoint from './model-point.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const ResponseStatus = {
  Ok: 200,
  Redirection: 300
};

const Resource = {
  points: `points`,
  offers: `offers`,
  destinations: `destinations`
};

const checkStatus = (response) => {
  if (response.status >= ResponseStatus.Ok && response.status < ResponseStatus.Redirection) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

/**
 * Создает экземпляр класса API.
 *
 * @constructor
 * @param {Object} endPoint - основная часть URL
 * @param {Object} authorization - авторизация на сервере (сервер позволяет / не позволяет делать запросы)
 */

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  /**
   * Вызывает _load и превращает его в JSON
   * @return {Array} - массив объектов tasks
   */

  getPoints() {
    return this._load({url: Resource.points})
      .then(toJSON)
      .then(ModelPoint.parsePoints);
  }

  getOffers() {
    return this._load({url: Resource.offers})
      .then(toJSON);
  }

  getDestinations() {
    return this._load({url: Resource.destinations})
      .then(toJSON);
  }

  createPoint({point}) {
    return this._load({
      url: Resource.points,
      method: Method.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  /**
   * Функция осуществляет все запросы.
   * @param {Object} url - URL, по которому надо сделать запрос
   * @param {Object} method - тип запроса
   * @param {Object} body
   * @param {Object} headers - объект для передачи заголовков серверу (по умолчанию пустой)
   * @returns {Object} fetch  - строит URL запроса на основе endPoint и переданного url
   */

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  syncPoints({points}) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(points),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }
}
