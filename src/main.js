import { makeElement, removeChildren, getRandomNumber } from "./util";
import getFilterHtml from "./make-filter";
import makeTripPoint from "./make-trip-point";
import { getTripPointList } from "./data";

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

const TRIP_POINTS_MAX = 5;

const createTripPointElement = tripPoint => {
  return makeElement(makeTripPoint(tripPoint));
};

const createTripPointElementList = tripPointsMax => {
  const fragment = document.createDocumentFragment();
  const tripPointList = getTripPointList();
  tripPointList.slice(0, tripPointsMax).forEach(tripPoint => {
    const tripPointElement = createTripPointElement(tripPoint);
    fragment.appendChild(tripPointElement);
  });
  return fragment;
};

const addTripPointElements = tripPointsMax => {
  const tripPointElementList = createTripPointElementList(tripPointsMax);
  $tripDayItems.appendChild(tripPointElementList);
};

addTripPointElements(TRIP_POINTS_MAX);

// tripPoint module End

// filter events

$tripFilter.addEventListener(`click`, evt => {
  if (evt.target.classList.contains(ClassName.TRIP_FILTER_NAME)) {
    removeChildren($tripDayItems);
    addTripPointElements(getRandomNumber(5));
  }
});

// filter events End
