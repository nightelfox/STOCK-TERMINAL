import * as d3 from 'd3-scale';

export const chartLocale = {
  dateTime: '%A, %e %B %Y г. %X',
  date: '%d.%m.%Y',
  time: '%H:%M:%S',
  periods: ['AM', 'PM'],
  days: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
  shortDays: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  months: [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ],
  shortMonths: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
};

export const margin = { top: 0, right: 20, bottom: 50, left: 50 };
export const CHART_WIDTH = window.innerWidth * 0.7 - margin.left - margin.right;
export const CHART_HEIGHT = window.innerHeight * 0.5 - margin.top - margin.bottom;
export const chartAreaWidth = CHART_WIDTH + margin.left + margin.right;
export const chartAreaHeight = CHART_HEIGHT + margin.top + margin.bottom;

export const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
