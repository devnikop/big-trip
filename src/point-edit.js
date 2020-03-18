import moment from 'moment';
import flatpickr from 'flatpickr';
import Component from './component.js';
import {ICONS_MAP} from './data.js';
import {createElement} from './utils.js';

/**
 * Класс описывает точку маршрута в режиме редактирования.
 */

export default class PointEdit extends Component {
  /**
  * Создаёт экземпляр класса PointEdit.
  * @constructor
  * @this  {PointEdit}
  * @param {Object} data - объект с данными точки маршрута.
  * @param {Object} allDestination - объект с данными направления.
  * @param {Object} allOffers - объект с офферами.
  */
  constructor(data, allDestination, allOffers) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._icon = ICONS_MAP.get(this._type);
    this._city = data.city;
    this._description = data.description;
    this._price = data.price;
    this._offers = data.offers;
    this._offersPrice = data.offersPrice;
    this._startTime = data.startTime;
    this._endTime = data.endTime;
    this._pictures = data.pictures;
    this._isFavorite = data.isFavorite;
    this._allDestinations = allDestination;
    this._allOffers = allOffers;

    this._onSubmit = null;
    this._onReset = null;
    this._onEsc = null;
    this._flatpickrStartTime = null;
    this._flatpickrEndTime = null;

    this._onChangeType = this._onChangeType.bind(this);
    this._onChangeDestination = this._onChangeDestination.bind(this);
    this._onChangeFavorite = this._onChangeFavorite.bind(this);
    this._onSubmitForm = this._onSubmitForm.bind(this);
    this._onResetForm = this._onResetForm.bind(this);
    this._onEscPress = this._onEscPress.bind(this);
  }

  /**
   * Вспомогательный метод для конвертации информации из формы в данные, понятные компоненту
   * @param {FormData} formData - данные из формы (массив массивов [поле, значение])
   * @return {Object} - объект, куда записана информация из формы
   */
  _processForm(formData) {
    const entry = {
      icon: this._icon,
      type: this._type,
      city: this._city,
      offers: this._offers,
      pictures: this._pictures,
      startTime: this._startTime,
      endTime: this._endTime,
      description: this._description,
      isFavorite: this._isFavorite,
      price: 0,
    };

    const pointEditMapper = PointEdit.createMapper.call(this, entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;

      if (pointEditMapper[property]) {
        pointEditMapper[property](value);
      }
    }
    return entry;
  }

  /**
   * Обработчик клика в окне выбора типа точки путешествия
   * @param {Event} evt - событие
   */
  _onChangeType(evt) {
    if (evt.target.classList[0] === `travel-way__select-label`) {
      const str = evt.target.textContent;
      this._icon = str.charAt(0) + str.charAt(1);
      this._type = str.charAt(3).toUpperCase() + str.slice(4);

      if (this._allOffers) {
        this._offers = [];
        this._allOffers.map((values) => {
          if (values.type === this._type.toLowerCase()) {
            this._offers = values.offers.map((offer) => {
              return {
                title: offer.name,
                price: offer.price,
                accepted: false
              };
            });
          }
        });
      }

      this.unbind();
      this._partialUpdate();
      this.bind();
    }
  }

  _onChangeDestination(evt) {
    if (this._allDestinations) {
      this._allDestinations.map((destination) => {
        if (destination.name === evt.target.value) {
          this._city = destination.name;
          this._description = destination.description;
          this._pictures = destination.pictures;

          this.unbind();
          this._partialUpdate();
          this.bind();
        }
      });
    }
  }

  _onChangeFavorite(evt) {
    this._isFavorite = evt.checked;
  }

  _partialUpdate() {
    this.unbind();
    this._element.innerHTML = createElement(this.template).innerHTML;
    this.bind();
  }

  /**
   * Обработчик события клика на кнопку сохранения точки путешествия (save формы)
   * @param {Object} evt  - объект события Event
   */
  _onSubmitForm(evt) {
    const offersMap = new Map();

    Array.from(this._element.querySelectorAll(`.point__offers-input`)).map((element) => {
      const title = element.value;
      const isChecked = element.checked;
      offersMap.set(title, isChecked);
    });

    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`form`));
    const newData = this._processForm(formData);

    for (let offer of newData.offers) {
      const title = offer.title;
      offer.accepted = offersMap.get(title);
    }

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  /**
   * Обработчик события клика на кнопку Delete (reset формы)
   * @param {Object} evt  - объект события Event
   */
  _onResetForm(evt) {
    evt.preventDefault();
    if (typeof this._onReset === `function`) {
      this._onReset();
    }
  }

  _onEscPress(evt) {
    if (typeof this._onEsc === `function`) {
      if (evt.keyCode === 27) {
        this._onEsc();
      }
    }
  }

  /**
   * Сеттер для передачи коллбэка при нажатии на кнопку "Save"
   * @param {Function} fn - передаваемая функция-коллбэк
   */
  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  /**
   * Сеттер для передачи коллбэка при нажатии на кнопку "Reset"
   * @param {Function} fn - передаваемая функция-коллбэк
   */
  set onReset(fn) {
    this._onReset = fn;
  }

  set onEsc(fn) {
    this._onEsc = fn;
  }

  /**
   * Геттер для получения шаблонной строки точки маршрута.
   * @return {string} шаблонная строка
   */
  get template() {
    const offers = this._offers.map((offer) => {
      return `
      <input class="point__offers-input visually-hidden" type="checkbox" id="${offer.title}" name="offer" value="${offer.title}" ${offer.accepted ? `checked` : ``}>
      <label for="${offer.title}" class="point__offers-label">
        <span class="point__offer-service">${offer.title}</span> + €<span class="point__offer-price">${offer.price}</span>
      </label>`;
    }).join(``);

    const pictures = this._pictures.map((picture) => `
      <img src="${picture.src}" alt="${picture.description}" class="point__destination-image">
    `);

    return `
    <article class="point">
    <form class="point__form" action="" method="get">
      <header class="point__header">
        <label class="point__date">
          choose day
          <input class="point__input" type="text" placeholder="${moment(this._startTime).format(`MMM D`)}" name="day" readonly>
        </label>

        <div class="travel-way">
          <label class="travel-way__label" for="travel-way__toggle">${this._icon}</label>

          <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

          <div class="travel-way__select">
            <div class="travel-way__select-group">
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi" ${this._type === `Taxi` && `checked`}>
              <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus" ${this._type === `Bus` && `checked`}>
              <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train" ${this._type === `Train` && `checked`}>
              <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-ship" name="travelWay" value="ship" ${this._type === `Ship` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-ship">🛳️ship</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-transport" name="travelWay" value="transport" ${this._type === `Transport` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-transport">🚊 transport</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-drive" name="travelWay" value="drive" ${this._type === `Drive` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-drive">🚗 drive</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="flight" ${this._type === `Flight` && `checked`}>
              <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
            </div>

            <div class="travel-way__select-group">
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in" ${this._type === `Check-in` && `checked`}>
              <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sightseeing" ${this._type === `Sightseeing` && `checked`}>
              <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-restaurant" name="travelWay" value="restaurant" ${this._type === `Restaurant` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-restaurant">🍴 restaurant</label>
            </div>
          </div>
        </div>
        <div class="point__destination-wrap">
          <label class="point__destination-label" for="destination">${this._type} ${this._type !== `Check-in` && this._type !== `Sightseeing` && this._type !== `Restaurant` ? `to` : `in`}</label>
          <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
          <datalist id="destination-select">
            ${this._allDestinations.map((destination) => {
    return `<option value="${destination.name}"></option>`;
  })}
          </datalist>
        </div>

        <div class="point__time">
          choose time
          <input class="point__input" type="text" value="19:00" name="date-start" placeholder="19:00">
          <span class="point__time-separator"> — </span>
          <input class="point__input" type="text" value="21:00" name="date-end" placeholder="21:00">
        </div>

        <label class="point__price">
          write price
          <span class="point__price-currency">€</span>
          <input class="point__input" type="text" value="${this._price}" name="price">
        </label>

        <div class="point__buttons">
          <button class="point__button point__button--save" type="submit">Save</button>
          <button class="point__button point__button--delete" type="reset">Delete</button>
        </div>

        <div class="paint__favorite-wrap">
          <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
          <label class="point__favorite" for="favorite">favorite</label>
        </div>
      </header>

      <section class="point__details">
        <section class="point__offers">
          <h3 class="point__details-title">offers</h3>

          <div class="point__offers-wrap">${offers}
          </div>

        </section>
        <section class="point__destination">
          <h3 class="point__details-title">Destination</h3>
          <p class="point__destination-text">${this._description}</p>
          <div class="point__destination-images">${pictures}
          </div>
        </section>
        <input type="hidden" class="point__total-price" name="total-price" value="">
      </section>
    </form>
  </article>
    `.trim();
  }

  /**
   * Метод для установки обработчиков.
   */
  bind() {
    this._element.querySelector(`form`).addEventListener(`submit`, this._onSubmitForm);
    this._element.querySelector(`form`).addEventListener(`reset`, this._onResetForm);
    this._element.querySelector(`.travel-way__select`).addEventListener(`click`, this._onChangeType);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`input[name="favorite"]`).addEventListener(`change`, this._onChangeFavorite);
    this._times = this._element.querySelectorAll(`.point__time input`);
    this._inputStartTime = this._times[0];
    this._inputEndTime = this._times[1];
    document.addEventListener(`keydown`, this._onEscPress);

    this._flatpickrStartTime = flatpickr(this._inputStartTime, {
      'enableTime': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `Z`,
      'minuteIncrement': 1,
      'defaultDate': moment(this._startTime).format(),
      'maxDate': this._inputEndTime,
      'onChange': (selectedDates) => {
        this._flatpickrEndTime.set(`minDate`, selectedDates[0]);
      }
    });

    this._flatpickrEndTime = flatpickr(this._inputEndTime, {
      'enableTime': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `Z`,
      'minuteIncrement': 1,
      'defaultDate': moment(this._endTime).format(),
      'minDate': this._inputStartTime,
      'onChange': (selectedDates) => {
        this._flatpickrStartTime.set(`maxDate`, selectedDates[0]);
      },
    });
  }

  /**
   * Метод для удаления обработчиков.
   */
  unbind() {
    this._element.querySelector(`form`).removeEventListener(`submit`, this._onSubmitForm);
    this._element.querySelector(`form`).removeEventListener(`reset`, this._onResetForm);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`click`, this._onChangeType);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`input[name="favorite"]`).removeEventListener(`change`, this._onChangeFavorite);
    document.removeEventListener(`keydown`, this._onEscPress);
  }

  /**
   * Метод для обновления данных.
   * @param {Object} data - объект с данными для обновления.
   */
  update(data) {
    this._type = data.type;
    this._city = data.city;
    this._price = data.price;
    this._offers = data.offers;
    this._offersPrice = data.offersPrice;
    this._startTime = data.startTime;
    this._endTime = data.endTime;
    this._isFavorite = data.isFavorite;
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  /**
   * Статический метод для преобразования данных.
   * Сопоставляет поля формы с полями структуры и записать в них полученные значения.
   * @param {Object} target - объект, в который будет записан результат преобразования.
   * @return {Object} - новый объект, поля которого - это функции для преобразования значений
   * из соответствующих полей формы и записи результата в target.
   */

  static createMapper(target) {
    return {
      'travel-way': (value) => {
        target.type = value.charAt(0).toUpperCase() + value.slice(1);
      },
      'destination': (value) => (target.destination = value),
      'price': (value) => (target.price = value),
      'date-start': (value) => {
        target.startTime = Date.parse(value);
      },
      'date-end': (value) => {
        target.endTime = Date.parse(value);
      },
      'description': (value) => (target.description = value),
      'is-favorite': (value) => (target.isFavorite = value),
      'pictures': (value) => (target.pictures = value),
    };
  }
}
