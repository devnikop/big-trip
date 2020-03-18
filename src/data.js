import moment from 'moment';

const FILTERS = [
  {
    caption: `Everything`,
    isChecked: true,
  },
  {
    caption: `Future`,
    isChecked: false,
  },
  {
    caption: `Past`,
    isChecked: false
  },
];

const SORTING = [
  {
    caption: `event`,
    isChecked: true,
  },
  {
    caption: `time`,
    isChecked: false,
  },
  {
    caption: `price`,
    isChecked: false
  },
  {
    caption: `offers`,
    isChecked: false
  }
];

const ICONS_MAP = new Map([
  [`Taxi`, `🚕`],
  [`Bus`, `🚌`],
  [`Train`, `🚂`],
  [`Ship`, `🛳️`],
  [`Transport`, `🚊`],
  [`Drive`, `🚗`],
  [`Flight`, `✈️`],
  [`Check-in`, `🏨`],
  [`Sightseeing`, `🏛️`],
  [`Restaurant`, `🍴`],
]);

const POINT_DEFAULT = {
  id: null,
  type: `Taxi`,
  city: ``,
  description: ``,
  price: 0,
  offers: [],
  pictures: [],
  isFavorite: false,
  destination: [],
  startTime: moment(),
  endTime: moment()
};

export {POINT_DEFAULT, FILTERS, SORTING, ICONS_MAP};
