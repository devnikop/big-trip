import Component from './component.js';

/**
 * Класс фильтра.
 */
export default class Filter extends Component {
  /**
   * Создает экземпляр класса Filter.
   *
   * @constructor
   * @param {Object} data - объект с данными фильтра
   * @this  {Filter}
   */
  constructor(data) {
    super();
    this._caption = data.caption;
    this._state.isChecked = data.isChecked;

    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  /**
   * Метод-обработчик нажатия на фильтр.
   * @param {Object} evt - объект события Event
   */
  _onFilterClick(evt) {
    if (typeof this._onFilter === `function`) { // проверка, а вдруг _onFilter перезаписали
      this._onFilter(evt);
    }
  }

  /**
   * Сеттер для передачи коллбэка при выборе фильтра.
   * @param {Function} fn - передаваемая функция-коллбэк
   */
  set onFilter(fn) {
    this._onFilter = fn;
  }

  /**
   * Геттер для получения шаблонной строки фильтра.
   * @return  {string} шаблонная строка
   */
  get template() {
    return `
      <span>
        <input class = "trip-filter__input" type="radio"
          id="filter-${this._caption.toLowerCase()}"
          name="filter"
          value="${this._caption}"
          ${this._state.isChecked ? `checked` : ``}
        />
        <label
          class="trip-filter__item"
          for="filter-${this._caption.toLowerCase()}">${this._caption}
        </label>
      </span>`.trim();
  }

  /**
   * Метод для создания обработчиков.
   */
  bind() {
    this._element.querySelector(`.trip-filter__input`).addEventListener(`click`, this._onFilterClick);
  }

  /**
   * Метод для удаления обработчиков.
   */
  unbind() {
    this._element.querySelector(`.trip-filter__input`).removeEventListener(`click`, this._onFilterClick);
  }
}
