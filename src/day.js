import moment from 'moment';
import Component from './component.js';

export default class Day extends Component {
  constructor(data) {
    super();
    this._date = data.startTime;
  }

  get template() {
    return `
    <section class="trip-day">
      <article class="trip-day__info">
        <span class="trip-day__caption">Day</span>
        <p class="trip-day__number">${moment(this._date).format(`D`)}</p>
        <h2 class="trip-day__title">${moment(this._date).format(`MMM YY`)}</h2>
      </article>
      <div class="trip-day__items">
      </div>
    </section>`.trim();
  }

  update(data) {
    this._date = data.startTime;
  }
}
