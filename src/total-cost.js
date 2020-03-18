import Component from './component.js';

export default class TotalCost extends Component {
  constructor(cost) {
    super();
    this._cost = cost;
  }

  get template() {
    return `<p class="trip__total">Total: <span class="trip__total-cost">&euro;&nbsp;${this._cost}</span></p>`.trim();
  }

  update(cost) {
    this._cost = cost;
  }
}
