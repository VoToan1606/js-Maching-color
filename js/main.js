import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import { getColorBackground, getColorElementList, getColorElementListNotActive, getColorListElement, getPlayAgainButton } from './selectors.js';
import { createTimer, getRandomColorPairs, hidePlayAgainBtn, setTimertext, showPlayAgainBtn } from './utils.js';

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
    seconds:GAME_TIME,
    onChange:handleTimerChange,
    onFinish:hanldeTimerFinish,
})

function handleTimerChange(second) {
    const fullSecond = `0${second}`.slice(-2)
    setTimertext(fullSecond + 's')
}

function hanldeTimerFinish() {
    gameStatus = GAME_STATUS.FINISHED
    setTimertext('GAME OVER 🤦‍♀️🤦‍♀️🤦‍♀️')
    showPlayAgainBtn()
}
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click


function initColors() {
    const colorList = getRandomColorPairs(PAIRS_COUNT)
    const liElementList = getColorElementList()

    liElementList.forEach((li, index) => {
        li.dataset.color = colorList[index]
        const overlay = li.querySelector('.overlay')
        overlay.style.backgroundColor = colorList[index]
    });
}

function handleChangeBackGround(color) {
    const colorBackGround = getColorBackground()
    colorBackGround.style.backgroundColor = color
}

function handleClickLiElement(liElement) {
    const shouldBlocking = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
    if(shouldBlocking) return

    liElement.classList.add('active')

    selections.push(liElement)
    if(selections.length < 2) return
   
    const firstLi = selections[0].dataset.color
    const secondLi = selections[1].dataset.color
    const isMatched = firstLi === secondLi
    if(isMatched) {
        //if color 2 li are same
        handleChangeBackGround(firstLi)
        const liNotActiveList = getColorElementListNotActive()
        const isfinished = liNotActiveList.length === 0
        if(isfinished) {
            showPlayAgainBtn()
            setTimertext('YOU WIN! 🎉🎉🎉')
            timer.clear()
            gameStatus = GAME_STATUS.FINISHED
        }
         //reset section
         selections = []
         return
    }
    //if color 2 li not same
    gameStatus = GAME_STATUS.BLOCKING
        setTimeout(() => {
            selections[0].classList.remove('active')
            selections[1].classList.remove('active')
            //reset section
            selections = []
            if(gameStatus !== GAME_STATUS.FINISHED) {
                gameStatus = GAME_STATUS.PLAYING
            }
        }, 500)
    
}

function attachEventForColorList() {
    const ulElement = getColorListElement()
    ulElement.addEventListener('click',(e) => {
        handleClickLiElement(e.target)
    })
}

function resetGame() {
    //reset section and status
    selections = []
    gameStatus = GAME_STATUS.PLAYING
    //reset li dom
    const liList = getColorElementList()
    for (const li of liList) {
        li.classList.remove('active')
    }
    hidePlayAgainBtn()
    //reset textTimer]
    setTimertext('')
    //reset timer
    starTimer()
    //reset color
    initColors()
}

function attachEventForPlayAgainbtn() {
    const playAgainBtn = getPlayAgainButton()
    playAgainBtn.addEventListener('click', resetGame)
}

function starTimer() {
    timer.start()
}

//main
(()=> {
    initColors()
    attachEventForColorList()
    attachEventForPlayAgainbtn()
    starTimer()
})()


