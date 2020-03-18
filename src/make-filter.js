import { capitalizeString } from "./util";

const getFilterHtml = title => `
  <input
    type="radio"
    id="filter-${title}"
    name="filter"
    value="${title}"
    checked
    />
    <label class="trip-filter__item" for="filter-${title}"
    >${capitalizeString(title)}</label
  >
`;

export default getFilterHtml;
