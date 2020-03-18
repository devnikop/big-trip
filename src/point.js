import moment from 'moment';
import Component from './component.js';
import {ICONS_MAP} from './data.js';

/**
 * Класс описывает точку маршрута в режиме просмотра.
 */

export default class Point extends Component {
  /**
  * Создаёт экземпляр класса Point.
  * @constructor
  * @this  {Point}
  * @param {Object} data - объект с данными точки маршрута.
  */
  constructor(data) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._icon = ICONS_MAP.get(this._type);
    this._description = data.description;
    this._offers = data.offers;
    this._price = data.price;
    this._startTime = data.startTime;
    this._endTime = data.endTime;
    this._city = data.city;
    this._pictures = data.pictures;
    this._offers = data.offers;
    this._offersPrice = data.offersPrice;
    this._isFavorite = data.isFavorite;
    this._onClick = null;
    this._onPointClick = this._onPointClick.bind(this);
  }

  /**
    * Обработчик нажатия на точку маршрута, переход в режим редактирования
    * @param {Object} evt - объект события Event.
    */
  _onPointClick(evt) {
    evt.preventDefault();
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  /**
   * Сеттер для передачи колбэка по нажатию на точку маршрута, переход в режим редактирования.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onClick(fn) {
    this._onClick = fn;
  }


  // Расчёт продолжительности точик маршрута (события).

  _getDuration() {
    return moment.duration(moment(this._endTime).diff(moment(this._startTime)));
  }

  /**
   * Геттер для получения шаблонной строки точки маршрута.
   * @return {string} шаблонная строка
   */
  get template() {
    return `
    <article class="trip-point">
      <i class="trip-icon">${this._icon}</i>
      <h3 class="trip-point__title">${this._type} ${this._type !== `Check-in` && this._type !== `Sightseeing` && this._type !== `Restaurant` ? `to` : `in`} ${this._city}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${moment(this._startTime).format(`H:mm`)} — ${moment(this._endTime).format(`H:mm`)}</span>
        <span class="trip-point__duration">${this._getDuration().days() ? ` ${this._getDuration().days()}d` : ``} ${this._getDuration().hours()}h ${this._getDuration().minutes()}m</span>
      </p>
      <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
      <ul class="trip-point__offers">${this._offers.map((offer) => {
    if (offer.accepted) {
      return `
        <li>
          <button class="trip-point__offer">${offer.title} +&euro;&nbsp;${offer.price}</button>
        </li>`;
    }
    return ``;
  }).join(``)}
      </ul>
    </article>`.trim();
  }

  /**
   * Метод для установки обработчиков.
   */
  bind() {
    this._element.addEventListener(`click`, this._onPointClick);
  }

  /**
   * Метод для удаления обработчиков.
   */
  unbind() {
    this._element.removeEventListener(`click`, this._onPointClick);
  }

  /**
   * Метод для обновления данных.
   * @param {Object} data - объект с данными для обновления.
   */
  update(data) {
    this._type = data.type;
    this._icon = ICONS_MAP.get(this._type);
    this._price = data.price;
    this._offers = data.offers;
    this._offersPrice = data.offersPrice;
    this._startTime = data.startTime;
    this._endTime = data.endTime;
    this._city = data.city;
    this._isFavorite = data.isFavorite;
  }
}
