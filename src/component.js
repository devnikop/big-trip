import {createElement} from './utils.js';

export default class Component {
  constructor() {
    // Нельзя создавать экземпляр класса напрямую. Можно только наследоваться!
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
    this._state = {};
  }

  get element() {
    return this._element;
  }

  get template() {
    // У наследников template должен быть обязательно реализован
    throw new Error(`You have to define template.`);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  // Пустые методы переопределим в наследниках

  bind() {}

  unbind() {}

  unrender() {
    this.unbind();
    this._element.remove();
    this._element = null;
  }

  update() {}
}
