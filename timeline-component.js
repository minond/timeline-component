'use strict';

var DAY = 1000 * 60 * 60 * 24;

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

var dates = [
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

var start = first(dates).date,
    end = last(dates).date,
    total_days = days_between(start, end);

var $timeline = d3.select('#timeline')
    .attr('data-timeline-component', true);

var $dates = $timeline
    .selectAll('.date', plucker('label'))
    .data(dates)

$dates.enter().append('div')
    .attr('class', 'date')
    .attr('title', plucker('label'))
    .style('transform', 'scale(0)')
        .style('left', function (date) {
            return days_between(start, date.date) / total_days * 100 + '%';
        })
    .transition()
        .duration(500)
        .ease('exp-out')
        .style('transform', 'scale(1)')

$dates.exit().remove();
