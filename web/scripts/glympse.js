var $ = window.$;
var R = window.R;
var S = window.S;
var _ = window._;

$(() => {
  let host = window.document.location.host;
  let socket = new WebSocket('ws://' + host);

  socket.onmessage = executeCommand;
});

function executeCommand(event) {
  let data = JSON.parse(event.data);
  switch(data.type) {
    case 'glympse':
      executeGlympse(data);
      break;
    default:
      console.error('Command not supported:', data.type);
  }
}

function executeGlympse(data) {
  let $container = $('.glympse-container');
  let {command, url, id} = data;

  if (command === 'show') {
    let iframe = `<iframe src="${url}" frameBorder="0"></iframe>`;
    $container.empty().append($(iframe));
  } else if (command === 'hide') {
    $container.empty();
  }
}
