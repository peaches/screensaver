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


window.updateBusSchedule = (data) => {
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

  html = R.join('\n')(R.map(generateRow, routes))
  window.console.log('html is', html);
  $('.bus-schedule').html(html);
};

$(() => {
  //$('main img').attr('src', 'https://lh3.googleusercontent.com/-7L5ck8evgcE/VOwlB0ebIVI/AAAAAAAAAoc/vsfPo4X5Bek/s1600/DSC_0115.JPG');
  $('main img').attr('src', 'https://lh3.googleusercontent.com/-FjRXfJ5yWGk/VOwlBgvw50I/AAAAAAAAAoc/S15mCt7EQUs/s1600/faces.jpg');
});

$(() => {
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'jsonp',
    jsonpCallback: 'updateBusSchedule'
  });
});
