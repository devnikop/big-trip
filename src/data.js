import { getRandomArrayItem, getRandomFloorNumber } from "./util";

const TRIP_POINTS_COUNT = 20;

const mockData = {
  waypointList: [
    `taxi`,
    `bus`,
    `train`,
    `ship`,
    `transport`,
    `drive`,
    `flight`,
    `check-in`,
    `sightseeing`,
    `restaurant`
  ],
  endpointList: [`airport`, `geneva`, `chamonix`, `hotel`],

  offerList: [
    `Add luggage`,
    `Switch to comfort class`,
    `Add meal`,
    `Choose seats`
  ],

  descriptionText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,

  get waypoint() {
    return getRandomArrayItem(this.waypointList);
  },

  get endpoint() {
    return getRandomArrayItem(this.endpointList);
  },

  get picture() {
    return `http://picsum.photos/300/150?r=${Math.random()}`;
  },

  get offers() {
    return this.offerList.slice(0, getRandomFloorNumber(3));
  },

  get description() {
    return this.descriptionText.split(`. `).slice(0, getRandomFloorNumber(3));
  },

  get day() {
    return `1 Mar 18`;
  },

  get time() {
    return `10:00 - 11:00`;
  },

  get price() {
    return getRandomFloorNumber(50);
  }
};

const createTripPointData = index => ({
  id: index,
  waypoint: mockData.waypoint,
  endpoint: mockData.endpoint,
  picture: mockData.picture,
  offers: mockData.offers,
  day: mockData.day,
  time: mockData.time,
  price: mockData.price
});

const getTripPointList = () => {
  return Array.from({ length: TRIP_POINTS_COUNT }, (item, index) =>
    createTripPointData(index)
  );
};

export { getTripPointList };
