import { Component } from "./component";

const Waypoint = new Map([
  [`taxi`, `🚕`],
  [`bus`, `🚌`],
  [`train`, `🚂`],
  [`ship`, `🛳️`],
  [`transport`, `🚊`],
  [`drive`, `🚗`],
  [`flight`, `✈️`],
  [`check-in`, `🏨`],
  [`sightseeing`, `🏛️`],
  [`restaurant`, `🍴`]
]);

export default class TripPoint extends Component {
  constructor(props) {
    super();

    this._id = props.id;
    this._waypoint = props.waypoint;
    this._endpoint = props.endpoint;
    this._picture = props.picture;
    this._offers = props.offers;
    this._day = props.day;
    this._time = props.time;
    this._price = props.price;

    this._onClick = null;

    this._onTripPointClick = this._onTripPointClick.bind(this);
  }

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${Waypoint.get(this._waypoint)}</i>
        <h3 class="trip-point__title">${this._waypoint} to ${
      this._endpoint
    }</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable"
            >10:00&nbsp;&mdash; 11:00</span
          >
          <span class="trip-point__duration">1h 30m</span>
        </p>
        <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
        <ul class="trip-point__offers">
          ${this._offers
            .map(
              offer => `
                <li>
                  <button class="trip-point__offer">
                    ${offer} +&euro;&nbsp;20
                  </button>
                </li>
              `
            )
            .join(``)}
        </ul>
      </article>
    `;
  }

  set onClick(cb) {
    this._onClick = cb;
  }

  _bind() {
    this._element.addEventListener(`click`, this._onTripPointClick);
  }

  _unbind() {
    this._element.removeEventListener(`click`, this._onTripPointClick);
  }

  update(data) {
    this._waypoint = data.waypoint;
    this._endpoint = data.endpoint;
    this._picture = data.picture;
    this._offers = data.offers;
    this._day = data.day;
    this._time = data.time;
    this._price = data.price;
  }

  _onTripPointClick() {
    typeof this._onClick === `function` && this._onClick();
  }
}
