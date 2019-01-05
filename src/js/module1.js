const keys = document.querySelectorAll('.key')

function playDrum(e) {
  // console.log(e.keyCode)
  const keycode = e.keyCode
  const audio = document.querySelector(`audio[data-key='${keycode}']`)
  const key = document.querySelector(`.key[data-key='${keycode}']`)

  if (!audio) return
  
  audio.currentTime = 0
  audio.play()

  // const keys = document.querySelectorAll('.key')
  key.classList.add('playing')
}

function removeTransition (e) {
  if (e.propertyName !== 'transform') return
  this.classList.remove('playing')
}

keys.forEach(key => key.addEventListener('transitionend', removeTransition))
window.addEventListener('keydown', playDrum)
