var $ = window.$;
var R = window.R;
var moment = window.moment;

function getRelativeMinutes(time, relativeTo) {
  relativeTo = relativeTo || new Date();
  return moment(time).diff(relativeTo, 'minutes');
}

function getRouteMinutes(route) {
  if (route.predictedArrivalTime) {
    return R.merge(route, {
      predicted: true,
      arrival: getRelativeMinutes(route.predictedArrivalTime),
      delta: getRelativeMinutes(route.predictedArrivalTime, route.scheduledArrivalTime)
    });
  } else {
    return R.merge(route, {
      predicted: false,
      arrival: getRelativeMinutes(route.scheduledArrivalTime),
      delta: 0
    });
  }
}

var routeAndArrivalTime = R.map(
  R.compose(
    getRouteMinutes,
    R.pick(['tripHeadsign', 'routeShortName', 'predictedArrivalTime', 'scheduledArrivalTime'])
  )
);


window.updateBusSchedule = function(data)  {
  window.console.log(routeAndArrivalTime(data.data.entry.arrivalsAndDepartures));
  var routes = routeAndArrivalTime(data.data.entry.arrivalsAndDepartures),
      generateRow, generateDelta, deltaClass, html;

  deltaClass = function(delta, arrival) {
    if (arrival < 0) {
      return 'negative';
    }

    if (delta > 0) {
      return 'positive';
    } else if (delta < 0) {
      return 'negative';
    }

    return '';
  }

  generateDelta = function(delta) {
    if (!delta || delta === 0) {
      delta = '----';
    }
    return (("<div class=\"delta\">" + delta) + "</div>");
  };

  generateRow = function(route) {
    return (("\
\n      <div class=\"row\">\
\n        <div class=\"route\">\
\n          " + (route.routeShortName)) + ("\
\n        </div>\
\n        <div class=\"description\">\
\n          " + (route.tripHeadsign.toLowerCase())) + ("\
\n        </div>\
\n        <div class=\"time " + (deltaClass(route.delta, route.arrival))) + ("\">\
\n          " + (route.arrival)) + ("\
\n          " + (generateDelta(route.delta))) + "\
\n        </div>\
\n      </div>\
\n    ");
  };

  html = R.join('\n')(R.map(generateRow, routes))
  window.console.log('html is', html);
  $('.bus-schedule').html(html);
};

$(function()  {
  //$('main img').attr('src', 'https://lh3.googleusercontent.com/-7L5ck8evgcE/VOwlB0ebIVI/AAAAAAAAAoc/vsfPo4X5Bek/s1600/DSC_0115.JPG');
  $('main img').attr('src', 'https://lh3.googleusercontent.com/-FjRXfJ5yWGk/VOwlBgvw50I/AAAAAAAAAoc/S15mCt7EQUs/s1600/faces.jpg');
});

$(function()  {
  var url = 'http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_35741.json?key=v1_C5%2Baiesgg8DxpmG1yS2F%2Fpj2zHk%3Dc3BoZW5yeUBnbWFpbC5jb20%3D=';
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'jsonp',
    jsonpCallback: 'updateBusSchedule'
  });
});
