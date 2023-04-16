import { getPlayAgainButton, getTimerElement } from "./selectors.js";
// function shuffled(arr) {
//   if(!Array.isArray(arr) || arr.length <= 2) return arr;
//   for(let i = arr.length - 1; i > 0; i--) {
//      const j = Math.floor(Math.random() * (i+1))
//     [arr[i], arr[j]] = [arr[j], arr[i]]
//   }
//   return arr

// }

function shuffled(arr) {
  if (!Array.isArray(arr) || arr.length <= 1) return arr;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList =[]
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  for(let i = 0; i< count; i++) {
    const color = window.randomColor({
      luminosity: 'dark',
      hue:hueList[i % hueList.length]
    })
    colorList.push(color)
  }
  const fullColorList = [...colorList, ...colorList]
  shuffled(fullColorList)

  return fullColorList;
}

export function showPlayAgainBtn() {
  const playAgainBtn = getPlayAgainButton()
  if(playAgainBtn) playAgainBtn.classList.add('show')
}

export function hidePlayAgainBtn() {
  const playAgainBtn = getPlayAgainButton()
  if(playAgainBtn) playAgainBtn.classList.remove('show')
}

export function setTimertext(text) {
  const textElement = getTimerElement()
  textElement.textContent = text
}

export function createTimer({seconds, onChange, onFinish}) {
  let idClearTimeOut = null

  function start() {
    clear()

    let currentSecond = seconds 
    idClearTimeOut = setInterval(() => {
      // if(onChange) onchange(currentSecond)
      onChange?.(currentSecond)

      currentSecond --
      if(currentSecond < 0) {
        clear()
        onFinish?.()
      }
    }, 1000)
  }

  function clear() {
    clearInterval(idClearTimeOut)
  }
  
  return {
    start,
    clear
  }
}