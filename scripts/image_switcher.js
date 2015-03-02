var $ = window.$;
var R = window.R;
var S = window.S;
var _ = window._;

var IMAGES = [];
var currentPos = 0;

$(() => {
  getAvailableImages().then(showRandomImage);
  setInterval(showRandomImage, (S.config.interval || 30) * 1000);
});

function getAvailableImages() {
  return $.getJSON('/api/images').then((d) => {
    IMAGES = _.shuffle(d);
    currentPos = 0;
  });
}

function showRandomImage() {
  let img = IMAGES[currentPos++ % IMAGES.length];
  if (currentPos >= IMAGES.length) {
    getAvailableImages();
  }
  $('main img').attr('src', `/images/${img}`);
}
