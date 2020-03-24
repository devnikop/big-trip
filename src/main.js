import { makeElement, removeChildren, getRandomNumber } from "./util";
import getFilterHtml from "./make-filter";
import makeTripPoint from "./make-trip-point";
import { getTripPointData } from "./data";

console.log(getTripPointData(1));

const Selector = {
  TRIP_FILTER: `.trip-filter`,
  TRIP_DAY_ITEMS: `.trip-day__items`
};

const ClassName = {
  TRIP_FILTER_NAME: `trip-filter__item`
};

const FILTERS = [`everything`, `future`, `past`];

const $tripFilter = document.querySelector(Selector.TRIP_FILTER);
const $tripDayItems = document.querySelector(Selector.TRIP_DAY_ITEMS);

// filter module

const createFilterElement = filterName =>
  makeElement(getFilterHtml(filterName));

const createFilterElementList = () => {
  const fragment = document.createDocumentFragment();
  FILTERS.forEach(filterName => {
    const filterElement = createFilterElement(filterName);
    fragment.appendChild(filterElement);
  });
  return fragment;
};

const filterElementList = createFilterElementList();
$tripFilter.appendChild(filterElementList);

// filter module End

// tripPoint module

const TRIP_POINTS_COUNT = 4;

const createTripPointElement = () => {
  return makeElement(makeTripPoint());
};

const createTripPointElementList = tripPointsCount => {
  const fragment = document.createDocumentFragment();
  [...Array(tripPointsCount)].forEach(() => {
    const tripPointElement = createTripPointElement();
    fragment.appendChild(tripPointElement);
  });
  return fragment;
};

const addTripPointElements = tripPointsCount => {
  const tripPointElementList = createTripPointElementList(tripPointsCount);
  $tripDayItems.appendChild(tripPointElementList);
};

addTripPointElements(TRIP_POINTS_COUNT);

// tripPoint module End

// filter events

$tripFilter.addEventListener(`click`, evt => {
  if (evt.target.classList.contains(ClassName.TRIP_FILTER_NAME)) {
    removeChildren($tripDayItems);
    addTripPointElements(getRandomNumber(5));
  }
});

// filter events End
