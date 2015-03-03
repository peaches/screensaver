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

var routeAndArrivalTime = R.compose(
  R.map(
    R.compose(
      getRouteMinutes,
      R.pick(['tripHeadsign', 'routeShortName', 'predictedArrivalTime', 'scheduledArrivalTime'])
    )
  ),
  R.take(5)
);


window.updateBusSchedule = (data) => {
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
  };

  generateDelta = function(delta) {
    if (!delta || delta === 0) {
      delta = '----';
    }
    return `<div class="delta">${ delta }</div>`;
  };

  generateRow = function(route) {
    return `
      <div class="row">
        <div class="route">
          ${ route.routeShortName }
        </div>
        <div class="description">
          ${ route.tripHeadsign.toLowerCase() }
        </div>
        <div class="time ${deltaClass(route.delta, route.arrival)}">
          ${ route.arrival }
          ${ generateDelta(route.delta) }
        </div>
      </div>
    `;
  };

  html = R.join('\n')(R.map(generateRow, routes));
  $('.bus-schedule').html(html);
};

var refreshBusSchedule = () => {
  var url = 'http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_35741.json?key=v1_C5%2Baiesgg8DxpmG1yS2F%2Fpj2zHk%3Dc3BoZW5yeUBnbWFpbC5jb20%3D=';
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'jsonp',
    jsonpCallback: 'updateBusSchedule'
  });
};

refreshBusSchedule();
setInterval(refreshBusSchedule, 60000);
