import { createElement } from "./util";

export class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instanciate Component? only concrete one`);
    }

    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  bind() {}

  unbind() {}

  render() {
    this._element = createElement(this.template);
    this._bind();
    return this.element;
  }

  unrender() {
    this._unbind();
    this._element = null;
  }

  update() {}
}
