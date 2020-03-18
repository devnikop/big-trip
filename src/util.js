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

export { capitalizeString, makeElement, removeChildren, getRandomNumber };
