const capitalizeString = string => string[0].toUpperCase() + string.slice(1);

const makeElement = html => {
  const element = document.createElement(`div`);
  element.insertAdjacentHTML("beforeend", html);
  return element;
};

const removeChildren = parentNode => {
  while (parentNode.firstChild) {
    parentNode.lastChild.remove();
  }
};

const getRandomNumber = max => Math.ceil(Math.random() * max);
const getRandomFloorNumber = max => Math.floor(Math.random() * max);

const getRandomArrayItem = array =>
  array[Math.floor(Math.random() * array.length)];

export {
  capitalizeString,
  getRandomArrayItem,
  getRandomFloorNumber,
  getRandomNumber,
  makeElement,
  removeChildren
};
