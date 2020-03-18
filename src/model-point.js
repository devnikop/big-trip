/**
 * Класс-адаптер.
 */
export default class ModelPoint {
  /**
   * Создает экземпляр класса ModelPoint.
   * @constructor
   * @param {Object} data - объект с данными, пришедший с сервера
   * @this {ModelPoint}
   */

  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`].charAt(0).toUpperCase() + data[`type`].slice(1) || ``;
    this.price = data[`base_price`];
    this.startTime = data[`date_from`];
    this.endTime = data[`date_to`];

    this.city = data[`destination`][`name`];
    this.description = data[`destination`][`description`];
    this.pictures = data[`destination`][`pictures`];
    this.offers = data[`offers`];
    this.isFavorite = data[`is_favorite`];
    this.offersPrice = 0;

    if (this.offers !== undefined && this.offers.length > 0) {
      this.offersPrice = this.offers.map((offer) => {
        return offer.accepted ? offer.price : 0;
      }).reduce((acc, value) => {
        return acc + value;
      });
    }
  }

  /**
   * Метод преобразует данные в формат, понятный серверу.
   * @return {Object} - преобразованный объект
   */

  toRAW() {
    return {
      id: this.id,
      type: this.type.toLowerCase(),
      destination: {
        name: this.city,
        pictures: this.pictures,
        description: this.description,
      }
    };
  }

  static createRaw(data) {
    return {
      'id': data.id,
      'date_from': data.startTime,
      'date_to': data.endTime,
      'type': data.type,
      'base_price': data.price,
      'is-favorite': data.isFavorite,
      'offers': data.offers.map((item) => ({
        title: item.title,
        price: item.price,
        accepted: item.accepted,
      })),
      'destination': {
        'name': data.destination,
        'description': data.description,
        'pictures': data.pictures
      }
    };
  }

  /**
   * Статический метод для преобразования одной точки маршрута.
   * @param {Object} data - исходный объект с данными, пришедший с сервера
   * @return {Object} - преобразованный объект
   */

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  /**
   * Статический метод для преобразования массива точек.
   * @param {Array} data - массив с исходными объектами, пришедший с сервера
   * @return {Array} - массив преобразованных объектов
   */

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}
