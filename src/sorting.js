import Component from './component.js';

/**
 * Класс Сортировки.
 */
export default class Sorting extends Component {
  /**
   * Создает экземпляр класса Sorting.
   *
   * @constructor
   * @param {Object} data - объект с данными сортировки
   * @this  {Sorting}
   */
  constructor(data) {
    super();
    this._caption = data.caption;

    this._onSorting = null;
    this._onSortingClick = this._onSortingClick.bind(this);
  }

  /**
   * Метод-обработчик нажатия на элемент сортировки.
   * @param {Object} evt - объект события Event
   */
  _onSortingClick(evt) {
    if (typeof this._onSorting === `function`) { // проверка, а вдруг _onSorting перезаписали
      this._onSorting(evt);
    }
  }

  /**
   * Сеттер для передачи коллбэка при выборе сортировки.
   * @param {Function} fn - передаваемая функция-коллбэк
   */
  set onSorting(fn) {
    this._onSorting = fn;
  }

  /**
   * Геттер для получения шаблонной строки сортировки.
   * @return  {string} шаблонная строка
   */
  get template() {
    return `
    <span>
    <input type="radio" class="trip-sorting__input" name="trip-sorting" id="sorting-${this._caption}" value="${this._caption}" ${(this._caption === `event`) ? `checked` : ``}>
    <label class="trip-sorting__item trip-sorting__item--${this._caption}" for="sorting-${this._caption}">${this._caption}</label>
    </span>
    `.trim();
  }

  /**
   * Метод для создания обработчиков.
   */
  bind() {
    this._element.querySelector(`.trip-sorting__item`).addEventListener(`click`, this._onSortingClick);
  }

  /**
   * Метод для удаления обработчиков.
   */
  unbind() {
    this._element.querySelector(`.trip-sorting__item`).removeEventListener(`click`, this._onSortingClick);
  }
}
