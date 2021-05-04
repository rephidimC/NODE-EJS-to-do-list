//jshint esversion:6

// module.exports = getDate;

// the above works for a situation when there's only one fucntion in the whole document.
// but now we have mor than one, so we do sth new

exports.getDate = getDate;

function getDate() {
var today = new Date();
var options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

var dateToday= today.toLocaleDateString("en-US", options);
return dateToday;
}

//let's assume we have two functions and we want to use them inside this singular date.js,
//what to do is

exports.getDay = getDay;

function getDay() {
var today = new Date();
var options = {
  weekday: 'long',
};

var dateToday= today.toLocaleDateString("en-US", options);
return dateToday;
}
