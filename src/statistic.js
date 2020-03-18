import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Component from './component.js';
import {ICONS_MAP} from './data.js';

const MILLISECOND_IN_HOUR = 60 * 60 * 1000;

const isTransportType = (type) => {
  return !(type === `Restaurant` || type === `Check-in` || type === `Sightseeing`);
};

const getDataOfTransportForChart = (array) => {
  let map = new Map();

  for (let obj of array) {
    let key = obj.type;

    if (isTransportType(key)) {
      if (map.has(key)) {
        let number = map.get(key);
        map.set(key, number + 1);
      } else {
        map.set(key, 1);
      }
    }
  }

  return map;
};

const getDataOfPriceForChart = (array) => {
  let map = new Map();

  for (let obj of array) {
    let key = obj.type;
    let price = obj.price;

    if (map.has(key)) {
      let number = map.get(key);
      map.set(key, number + price);
    } else {
      map.set(key, price);
    }
  }

  return map;
};

const getDataOfTimeSpendForChart = (array) => {
  let map = new Map();

  for (let obj of array) {
    let key = obj.type;
    let duration = Math.round((obj.endTime - obj.startTime) / MILLISECOND_IN_HOUR);

    if (map.has(key)) {
      let number = map.get(key);
      map.set(key, number + duration);
    } else {
      map.set(key, duration);
    }
  }

  return map;
};

const generateLabelsMap = (incomingMap) => {
  let labelsMap = new Map();

  for (let incomingKey of incomingMap.keys()) {

    for (let key of ICONS_MAP.keys()) {
      if (incomingKey === key) {
        labelsMap.set(ICONS_MAP.get(key), key);
      }
    }
  }

  return labelsMap;
};

export default class Statistic extends Component {
  constructor(data) {
    super();
    this._barHeight = 55;
    this._data = data;

    this._chart = null;
    this._moneyCtx = null;
    this._transportCtx = null;
    this._timeSpendCtx = null;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;
    this._transportResult = null;
    this._priceResult = null;
    this._timeSpendResult = null;
    this._moneyLabels = null;
    this._transportLabels = null;
    this._timeSpendLabels = null;
    this._moneyData = null;
    this._transportData = null;
    this._timeSpendData = null;
  }

  get template() {
    return `
      <section class="statistic content-wrap visually-hidden" id="stats">
        <div class="statistic__item statistic__item--money">
        <canvas class="statistic__money" width="900"></canvas>
      </div>
        <div class="statistic__item statistic__item--transport">
          <canvas class="statistic__transport" width="900"></canvas>
        </div>
        <div class="statistic__item statistic__item--time-spend">
          <canvas class="statistic__time-spend" width="900"></canvas>
        </div>
      </section>`.trim();
  }

  _generateChartData() {
    this._transportResult = getDataOfTransportForChart(this._data);
    this._priceResult = getDataOfPriceForChart(this._data);
    this._timeSpendResult = getDataOfTimeSpendForChart(this._data);
    this._moneyLabels = Array.from(generateLabelsMap(this._priceResult).entries());
    this._transportLabels = Array.from(generateLabelsMap(this._transportResult).entries());
    this._timeSpendLabels = Array.from(generateLabelsMap(this._timeSpendResult).entries());
    this._moneyData = Array.from(this._priceResult.values());
    this._transportData = Array.from(this._transportResult.values());
    this._timeSpendData = Array.from(this._timeSpendResult.values());
  }

  renderCharts() {
    this._generateChartData();
    this._moneyCtx = this._element.querySelector(`.statistic__money`);
    this._transportCtx = this._element.querySelector(`.statistic__transport`);
    this._timeSpendCtx = this._element.querySelector(`.statistic__time-spend`);
    this._moneyCtx.height = this._barHeight * this._moneyLabels.length;
    this._transportCtx.height = this._barHeight * this._moneyLabels.length;
    this._timeSpendCtx.height = this._barHeight * this._timeSpendLabels.length;

    this._moneyChart = new Chart(this._moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._moneyLabels,
        datasets: [{
          data: this._moneyData,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    this._transportChart = new Chart(this._transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._transportLabels,
        datasets: [{
          data: this._transportData,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`
          }
        },
        title: {
          display: true,
          text: `TRANSPORT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    this._timeSpendChart = new Chart(this._timeSpendCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._timeSpendLabels,
        datasets: [{
          data: this._timeSpendData,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}H`
          }
        },
        title: {
          display: true,
          text: `TIME SPENT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  update() {
    this._generateChartData();
    this._moneyChart.data.labels = this._moneyLabels;
    this._moneyChart.data.datasets[0].data = this._moneyData;
    this._transportChart.data.labels = this._transportLabels;
    this._transportChart.data.datasets[0].data = this._transportData;
    this._timeSpendChart.data.labels = this._timeSpendLabels;
    this._timeSpendChart.data.datasets[0].data = this._timeSpendData;
    this._moneyChart.update();
    this._transportChart.update();
    this._timeSpendChart.update();
  }
}
