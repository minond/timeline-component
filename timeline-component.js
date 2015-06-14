'use strict';

/* global d3 */

var DAY = 1000 * 60 * 60 * 24;

/**
 * @param {Date} start
 * @param {Number} total_days
 * @return {Function<Date>}
 */
function day_offset_from(start, total_days) {
    return function (date) {
        return percent(days_between(start, date.date) / total_days * 100);
    };
}

/**
 * @param {Number} num
 * @param {Function<*>}
 * @return {Function<*>}
 */
function then_add(num, getter) {
    return function (val) {
        return getter.apply(null, arguments) + num;
    };
}

/**
 * @param {Number} multiplier
 * @return {Function<*, Number>}
 */
function incremental_by_index(multiplier) {
    return function (val, index) {
        return index * multiplier;
    };
}

/**
 * @param {Number} num
 * @return {String}
 */
function percent(num) {
    return num + '%';
}

/**
 * @param {Number} num
 * @return {String}
 */
function px(num) {
    return num + 'px';
}

/**
 * @param {Date} from
 * @param {Date} to
 * @return {Number}
 */
function days_between(from, to) {
    return (to - from) / DAY;
}

/**
 * @param {String} prop name
 * @return {Function<Obj>}
 */
function plucker(prop) {
    return function (obj) {
        return obj[prop];
    };
}

/**
 * @param {String} prop
 * @return {Function<Obj, Obj>}
 */
function sorter(prop) {
    return function (a, b) {
        return a[prop] > b[prop] ? 1 : -1;
    };
}

/**
 * @param {Array} arr
 * @return {*}
 */
function first(arr) {
    return arr[0];
}

/**
 * @param {Array} arr
 * @return {*}
 */
function last(arr) {
    return arr[arr.length - 1];
}

var dates_dataset = [
    {
        label: 'Registration',
        date: new Date('2015-06-20'),
    },
    {
        label: 'Launch',
        date: new Date('2015-06-01'),
    },
    {
        label: 'Judging',
        date: new Date('2015-06-29'),
    },
].sort(sorter('date'));

var start = first(dates_dataset).date,
    end = last(dates_dataset).date,
    total_days = days_between(start, end);

var days_dataset = [];

for (var i = 0; i <= total_days; i++) {
    days_dataset.push({
        offset: i,
        date: new Date(start.valueOf() + i * DAY)
    });
}

var $timeline = d3.select('#timeline')
    .attr('data-timeline-component', true);

var $dates = $timeline
    .append('div')
    .attr('class', 'dates')
    .selectAll('.date')
    .data(dates_dataset);

$dates.enter().append('div')
    .attr('data-date', plucker('date'))
    .attr('class', 'date')
    .style('transform', 'scale(0)')
    .style('left', day_offset_from(start, total_days))
    .style('top', px(-100))
    .transition()
        .delay(then_add(700, incremental_by_index(100)))
        .duration(800)
        .ease('exp-out')
        .style('top', px(-1))
        .style('transform', 'scale(1)');

var $days = $timeline
    .append('div')
    .attr('class', 'days')
    .selectAll('.day')
    .data(days_dataset);

$days.enter().append('div')
    .attr('data-date', plucker('date'))
    .attr('class', 'day')
    .transition()
        .delay(incremental_by_index(10))
        .duration(500)
        .style('opacity', 1)
        .style('left', day_offset_from(start, total_days));
