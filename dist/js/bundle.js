"use strict";

var keys = document.querySelectorAll('.key');

function playDrum(e) {
  // console.log(e.keyCode)
  var keycode = e.keyCode;
  var audio = document.querySelector("audio[data-key='".concat(keycode, "']"));
  var key = document.querySelector(".key[data-key='".concat(keycode, "']"));
  if (!audio) return;
  audio.currentTime = 0;
  audio.play(); // const keys = document.querySelectorAll('.key')

  key.classList.add('playing');
}

function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  this.classList.remove('playing');
}

keys.forEach(function (key) {
  return key.addEventListener('transitionend', removeTransition);
});
window.addEventListener('keydown', playDrum);
//# sourceMappingURL=bundle.js.map
