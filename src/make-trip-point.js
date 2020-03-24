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

const makeTripPoint = ({
  id,
  waypoint,
  endpoint,
  picture,
  offers,
  day,
  time,
  price
}) => `
  <article class="trip-point">
    <i class="trip-icon">${Waypoint.get(waypoint)}</i>
    <h3 class="trip-point__title">${waypoint} to ${endpoint}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable"
        >10:00&nbsp;&mdash; 11:00</span
      >
      <span class="trip-point__duration">1h 30m</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${price}</p>
    <ul class="trip-point__offers">
      ${offers
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

export default makeTripPoint;
