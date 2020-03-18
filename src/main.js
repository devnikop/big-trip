import {FILTERS, SORTING, POINT_DEFAULT} from './data.js';
import Filter from './filter.js';
import Sorting from './sorting.js';
import Point from './point.js';
import PointEdit from './point-edit.js';
import Day from './day.js';
import Statistic from './statistic.js';
import API from './api.js';
import Provider from './provider.js';
import Store from './store.js';
import ModelPoint from './model-point.js';
import TotalCost from './total-cost.js';
import moment from 'moment';

const AUTHORIZATION = `Basic eo0w590ik29lkkl88tr9a`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;
const POINTS_STORE_KEY = `points`;
const OFFERS_STORE_KEY = `offers`;
const DESTINATIONS_STORE_KEY = `destinations`;

const filtersContainer = document.querySelector(`.trip-filter`);
const sortingContainer = document.querySelector(`.trip-sorting`);
const buttonNewEvent = document.querySelector(`.trip-controls__new-event`);
const parentContainer = document.querySelector(`.trip-points`);

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const pointStore = new Store({key: POINTS_STORE_KEY, storage: localStorage});
const offerStore = new Store({key: OFFERS_STORE_KEY, storage: localStorage});
const destStore = new Store({key: DESTINATIONS_STORE_KEY, storage: localStorage});
const provider = new Provider({api, pointStore, offerStore, destStore, generateId: () => String(Day.now())});
const cost = new TotalCost(`0`);

let availablePoints = null;
let availableOffers = null;
let availableDestinations = null;
let emptyCardElement = null;
let dayList = null;
let editMode = false;

const calculateTotalDayPrice = (points) => {
  let prices = [];

  points.map((point) => {
    let totalDayPrice = +point.price;
    const totalOffersPrice = +point.offers.filter((offer) => offer.accepted === true).reduce((acc, offer) => acc + offer.price, 0);
    totalDayPrice += totalOffersPrice;
    prices.push(totalDayPrice);
  });
  return prices;
};

const calculateTripCost = (priceArr) => {
  const totalCost = priceArr.reduce((acc, price) => acc + price);
  return totalCost;
};

const renderTotalCost = (pointsArr) => {
  const costContainer = document.querySelector(`.trip__total`);
  cost.update(calculateTripCost(calculateTotalDayPrice(pointsArr)));
  costContainer.innerHTML = ``;
  costContainer.appendChild(cost.render());
};

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncPoints();
});

// Отрисовка статистики
const renderStatistic = () => {
  const statistic = new Statistic(availablePoints);
  const mainContainer = document.querySelector(`.main`);

  mainContainer.parentNode.appendChild(statistic.render());

  const statsContainer = document.querySelector(`.statistic`);
  const controlsBtnTable = document.querySelector(`.view-switch__item[href="#table"]`);
  const controlsBtnStats = document.querySelector(`.view-switch__item[href="#stats"]`);

  controlsBtnTable.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    if (!evt.target.classList.contains(`view-switch__item--active`)) {
      evt.target.classList.add(`view-switch__item--active`);
      controlsBtnStats.classList.remove(`view-switch__item--active`);
      mainContainer.classList.remove(`visually-hidden`);
      statsContainer.classList.add(`visually-hidden`);
    }

    return false;
  });

  controlsBtnStats.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    if (!evt.target.classList.contains(`view-switch__item--active`)) {
      evt.target.classList.add(`view-switch__item--active`);
      controlsBtnTable.classList.remove(`view-switch__item--active`);
      mainContainer.classList.add(`visually-hidden`);
      statsContainer.classList.remove(`visually-hidden`);
      statistic.update();
    }

    return false;
  });

  statistic.renderCharts();
};

// Загрузка данных с сервера (points, offers, destinations)
parentContainer.textContent = `Loading route...`;
const getData = () => {
  provider.getPoints()
  .then((points) => {
    availablePoints = points;
    renderPoints(points);
    renderTotalCost(points);
    renderStatistic();
  })
  .then(() => {
    provider.getOffers()
      .then((offers) => {
        availableOffers = offers;
        renderPoints(availablePoints);
      });
  })
  .then(() => {
    provider.getDestinations()
      .then((destinations) => {
        availableDestinations = destinations;
        renderPoints(availablePoints);
      });
  })
  .catch(() => {
    parentContainer.textContent = `Something went wrong while loading your route info. Check your connection or try again later`;
  });
};
getData();

/**
 * Фильтрации массива объектов
 * @param {Array} points - массив с данными
 * @param {string} filterName - имя фильтра
 * @return {Array} отфильтрованный массив
 */

const filterPoints = (points, filterName) => {
  let result;

  switch (filterName) {
    case `filter-everything`:
      result = points;
      break;

    case `filter-future`:
      result = points.filter((it) => it.startTime > Date.now());
      break;

    case `filter-past`:
      result = points.filter((it) => it.endTime < Date.now());
      break;
  }
  return result;
};

/**
 * Функция для отрисовки фильтров.
 * При изменении фильтра меняются points.
 * @param {Array} filters - массив объектов с данными о фильтрах
 * @param {Object} container - DOM-элемент, куда нужно отрисовать фильтры
 */

const renderFilters = (filters, container) => {
  filters.forEach((element) => {

    const filterComponent = new Filter(element);
    /**
     * Коллбэк для клика по фильтру
     * @param {Object} evt - объект события Event
     */
    filterComponent.onFilter = (evt) => {
      const filterName = evt.target.id || evt.target.htmlFor;
      const filteredPoints = filterPoints(availablePoints, filterName);
      renderPoints(filteredPoints);
    };
    container.appendChild(filterComponent.render());
  });
};

renderFilters(FILTERS, filtersContainer);

/**
 * Сортировка массива объектов
 * @param {Array} points - массив с данными
 * @param {string} sortName - имя сортировки
 * @return {Array} отсортированный массив
 */

const sortPoints = (points, sortName) => {
  let result;
  switch (sortName) {
    case `sorting-event`:
      result = points;
      break;

    case `sorting-time`:
      result = points;
      result = points.sort((a, b) => moment.duration(moment(b.endTime).diff(moment(b.startTime))) - moment.duration(moment(a.endTime).diff(moment(a.startTime))));
      break;

    case `sorting-price`:
      result = points.sort((a, b) => b.price - a.price);
      break;
  }
  return result;
};

/**
 * Функция для отрисовки элементов сортировки.
 * При изменении фильтра меняются points.
 * @param {Array} filters - массив объектов с данными об элементах сортировки
 * @param {Object} container - DOM-элемент, куда нужно отрисовать элементы сортировки
 */

const renderSort = (sorts, container) => {
  sorts.forEach((element) => {
    const sortComponent = new Sorting(element);

    sortComponent.onSorting = (evt) => {
      const sortName = evt.target.id || evt.target.htmlFor;
      const sortedPoints = sortPoints(availablePoints, sortName);
      renderPoints(sortedPoints);
    };
    container.appendChild(sortComponent.render());
  });
};

renderSort(SORTING, sortingContainer);

/**
 * Функция для замены одного объекта с данными в массиве объектов на другой.
 * С помощью метода Object.assign в новый объект {} записывает все поля, которые были в старом point,
 * затем записывает все поля, которые изменились после редактировния формы
 *
 * @param {Array} points - массив с данными
 * @param {Object} pointToUpdate - объект, который надо заменить
 * @param {Object} newPoint - новый объект
 * @return {Object} новый обновлённый объект
 */

const updatePoint = (points, pointToUpdate, newPoint) => {
  const index = points.findIndex((it) => it === pointToUpdate);
  points[index] = Object.assign({}, pointToUpdate, newPoint);
  return points[index];
};

/**
 * Функция для отрисовки массива точек маршрута.
 * @param {Array} points - массив с данными.
 * @param {Object} container - DOM-элемент, куда нужно отрисовать точки.
 */

const renderPoints = (points) => {
  document.querySelector(`.trip-points`).innerHTML = ``;

  const daysMap = new Map();

  points.forEach((point) => {
    const date = moment(point.startTime).format(`D MMM YY`);
    let pointsArray = daysMap.get(date);

    if (pointsArray === undefined) {
      pointsArray = [point];
    } else {
      pointsArray.push(point);
    }
    daysMap.set(date, pointsArray);
  });

  dayList = Array.from(daysMap.keys()).sort((dateA, dateB) => moment(dateA) - moment(dateB));

  for (let date of dayList) {
    const pointsArray = daysMap.get(date);
    const firstPoint = pointsArray[0];
    parentContainer.appendChild(new Day(firstPoint).render());

    pointsArray.forEach((point) => {
      let pointComponent = new Point(point);
      let editPointComponent = new PointEdit(point, availableDestinations, availableOffers);

      const allDayItemContainers = parentContainer.querySelectorAll(`.trip-day__items`);
      const lastContainerIndex = allDayItemContainers.length - 1;
      const lastDayItemsContainer = allDayItemContainers[lastContainerIndex];
      const lastTripDayContainer = parentContainer.querySelectorAll(`.trip-day`)[lastContainerIndex];
      lastDayItemsContainer.appendChild(pointComponent.render());
      /**
       * Коллбэк для перехода в режим редактирования
       */
      pointComponent.onClick = () => {
        if (editMode) {
          return;
        }

        editMode = true;
        hideNewCardForm();
        buttonNewEvent.disabled = true;
        editPointComponent.render();
        lastDayItemsContainer.replaceChild(editPointComponent.element, pointComponent.element);
        pointComponent.unrender();
      };
      /**
       * Коллбэк для выхода из режима редактирования.
       * @param {Object} newObject - объект, откуда обновляется информация.
       */
      editPointComponent.onSubmit = (newObject) => {
        const form = editPointComponent.element.querySelector(`.point__form`);
        const saveBtn = form.querySelector(`.point__button--save`);
        editPointComponent.disabled = true;

        const setSavingState = (isSaving) => {
          saveBtn.textContent = isSaving ? `Saving...` : `Save`;
        };

        setSavingState(true);

        provider.updatePoint({id: point.id, data: point.toRAW()})
          .then(() => {
            buttonNewEvent.disabled = false;
            const updatedPoint = updatePoint(points, point, newObject);
            pointComponent.update(updatedPoint);
            pointComponent.render();
            lastDayItemsContainer.replaceChild(pointComponent.element, editPointComponent.element);
            editPointComponent.unrender();
            setSavingState(false);
            editMode = false;
            renderTotalCost(points);
          })
          .catch(() => {
            editPointComponent.disabled = false;
            form.style.border = `1px solid red`;
            editPointComponent.shake();
            setSavingState(false);
          });
      };

      /**
       * Коллбэк для нажатия на кнопку Delete (reset формы)
       */
      editPointComponent.onReset = () => {
        const form = editPointComponent.element.querySelector(`.point__form`);
        const deleteBtn = form.querySelector(`.point__button--delete`);
        editPointComponent.disabled = true;

        const setDeletingState = (isDelete) => {
          deleteBtn.textContent = isDelete ? `Deleting...` : `Delete`;
        };

        setDeletingState(true);

        provider.deletePoint({id: point.id})
          .then(() => provider.getPoints())
          .then(() => {
            buttonNewEvent.disabled = false;
            lastDayItemsContainer.removeChild(editPointComponent.element);
            deletePointById(points, point.id);
            renderTotalCost(points);

            if (lastDayItemsContainer.childElementCount === 0) {
              parentContainer.removeChild(lastTripDayContainer);
            }

            renderStatistic();
            editMode = false;
          }).catch(() => {
            editPointComponent.disabled = false;
            form.style.border = `1px solid red`;
            editPointComponent.shake();
          });
      };

      editPointComponent.onEsc = () => {
        if (editPointComponent.element.parentNode.classList.contains(`trip-points`)) {
          editPointComponent.unrender();
        } else {
          pointComponent.render();
          editPointComponent.element.parentNode.replaceChild(pointComponent.element, editPointComponent.element);
          editPointComponent.unrender();
          editMode = false;
        }
      };
    });
  }
};

buttonNewEvent.addEventListener(`click`, () => {
  buttonNewEvent.disabled = true;
  const newPointComponent = new PointEdit(POINT_DEFAULT, availableDestinations, availableOffers);
  emptyCardElement = newPointComponent.render();
  parentContainer.insertBefore(emptyCardElement, parentContainer.firstChild);

  newPointComponent.onSubmit = (newObject) => {
    const form = newPointComponent.element.querySelector(`.point__form`);
    const saveBtn = form.querySelector(`.point__button--save`);
    newPointComponent.disabled = true;

    const setSavingState = (isSaving) => {
      saveBtn.textContent = isSaving ? `Saving...` : `Save`;
    };

    setSavingState(true);
    const newPoint = new Point(newObject);
    const data = {
      id: newObject.id,
      startTime: newObject.startTime,
      endTime: newObject.endTime,
      destination: newObject.destination,
      type: newObject.type,
      price: newObject.price,
      offers: newObject.offers,
      description: newObject.description,
      pictures: newObject.pictures,
      isFavorite: newObject.isFavorite
    };

    provider.createPoint({point: ModelPoint.createRaw(data)})
      .then((createdPoint) => {
        buttonNewEvent.disabled = false;
        addNewPoint(newPoint, createdPoint, availablePoints);
        setSavingState(false);
        hideNewCardForm();
        availablePoints.push(createdPoint);
        renderTotalCost(availablePoints);
      })
      .catch(() => {
        newPointComponent.disabled = false;
        form.style.border = `1px solid red`;
        newPointComponent.shake();
        setSavingState(false);
      });
  };
});

const addNewPoint = (point, data, pointsArr) => {
  const itemsContainerList = document.querySelectorAll(`.trip-day__items`);
  const day = moment(point._startTime).format(`D MMM YY`);
  let container;

  for (let i = 0; i < dayList.length; i++) {
    if (dayList[i] === day) {
      container = itemsContainerList[i];
      break;
    }

    if (i < dayList.length - 1) {
      const currDay = moment(point._startTime);
      const prevDay = moment(dayList[i]);
      const nextDay = moment(dayList[i + 1]);

      if (currDay.isAfter(prevDay) && currDay.isBefore(nextDay) || i === 0 && currDay.isBefore(prevDay)) {
        dayList.splice(i + 1, 0, day);
        const foundTripDay = parentContainer.querySelectorAll(`.trip-day`)[i + 1];
        const tripDay = new Day(data).render();
        parentContainer.insertBefore(tripDay, foundTripDay);
        container = document.querySelectorAll(`.trip-day__items`)[i + 1];
        break;
      }
    }
  }

  container.appendChild(point.render());

  point.onClick = () => {
    const pointEditComponent = new PointEdit(data, availableDestinations, availableOffers);
    container.replaceChild(pointEditComponent.render(), point.element);

    pointEditComponent.onSubmit = (newObject) => {
      const form = pointEditComponent.element.querySelector(`.point__form`);
      const saveBtn = form.querySelector(`.point__button--save`);
      pointEditComponent.disabled = true;

      const setSavingState = (isSaving) => {
        saveBtn.textContent = isSaving ? `Saving...` : `Save`;
      };

      setSavingState(true);
      const model = ModelPoint.createRaw(data);
      model.destination.name = data.city;

      provider.updatePoint({id: data.id, data: model})
        .then(() => {
          buttonNewEvent.disabled = false;
          point.update(newObject);
          point.render();
          container.replaceChild(point.element, pointEditComponent.element);
          setSavingState(false);
        })
        .catch(() => {
          pointEditComponent.disabled = false;
          form.style.border = `1px solid red`;
          pointEditComponent.shake();
          setSavingState(false);
        });
    };

    pointEditComponent.onReset = () => {
      const form = pointEditComponent.element.querySelector(`.point__form`);
      const deleteBtn = form.querySelector(`.point__button--delete`);
      pointEditComponent.disabled = true;

      const setDeletingState = (isDelete) => {
        deleteBtn.textContent = isDelete ? `Deleting...` : `Delete`;
      };

      setDeletingState(true);

      provider.deletePoint({id: data.id})
        .then(() => provider.getPoints())
        .then(() => {
          buttonNewEvent.disabled = false;
          container.removeChild(pointEditComponent.element);
          deletePointById(pointsArr, data.id);
          renderTotalCost(pointsArr);

          if (container.childElementCount === 0) {
            parentContainer.removeChild(container);
          }

          renderStatistic();
          editMode = false;
        })
        .catch(() => {
          pointEditComponent.disabled = false;
          form.style.border = `1px solid red`;
          pointEditComponent.shake();
        });
    };
  };
};

const hideNewCardForm = () => {
  if (emptyCardElement !== null) {
    if (parentContainer.contains(emptyCardElement)) {
      parentContainer.removeChild(emptyCardElement);
    }
    emptyCardElement = null;
  }
};

const deletePointById = (points, id) => {
  for (let i = 0; i < points.length; i++) {
    if (points[i].id === id) {
      points.splice(i, 1);
      break;
    }
  }
};
