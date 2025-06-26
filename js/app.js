'use strict'

const MINE = '💣'
const MARK = '🏳️'
const EMPTY = ' '

var gGame
var gBoard
var gTimerInterval
var gStartTime

var gLevel = {
  size: 4,
  mine: 2,
}

function onInit() {
  gGame = {
    isOn: true,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isVictory: false,
    lives: 3,
  }

  gBoard = buildBoard()
  renderBoard(gBoard, '.board')
  renderBtn()
  clearInterval(gTimerInterval)
  mineDisplay()
  timerDisplay()
  restartDisplay()
  livesDisplay(gGame.lives)
}

function buildBoard() {
  const board = []
  for (var i = 0; i < gLevel.size; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isRevealed: false,
        isMine: false,
        isMarked: false,
      }
    }
  }

  return board
}

function onChooseTheLevel(elBtn) {
  var levels = [4, 8, 12]

  var level = +elBtn.dataset.level

  if (level === 0) {
    gLevel.size = levels[0]
    gLevel.mine = 2
  } else if (level === 1) {
    gLevel.size = levels[1]
    gLevel.mine = 14
  } else if (level === 2) {
    gLevel.size = levels[2]
    gLevel.mine = 32
  }

  onInit()
}

function onCellClicked(elCell, i, j) {
  const cell = gBoard[i][j]

  if (cell.isRevealed) return
  if (!gGame.isOn) return
  if (cell.isMarked) return

  gGame.revealedCount++
  cell.isRevealed = true
  elCell.classList.remove('hide')

  if (gGame.revealedCount === 1) {
    startTimer()
    randomMind(gBoard, gLevel.mine, cell)
    setMinesNegsCount(gBoard)
    expandeReveal(i, j)
    return
  } else if (cell.minesAroundCount) {
    elCell.innerHTML = cell.minesAroundCount
  } else {
    elCell.innerText = EMPTY
    expandeReveal(i, j)
  }

  if (cell.isMine) {
    gGame.lives--
    livesDisplay(gGame.lives)
    if (gGame.lives === 0) {
      elCell.classList.remove('hide')
      gameOver('😖')
      exposeAllMines()
      return
    }

    cell.isRevealed = false
    elCell.innerHTML = MINE
    setTimeout(() => {
      gGame.revealedCount--
      elCell.classList.add('hide')
      elCell.innerHTML = EMPTY
    }, 500)
  }
  checkGameOver() ? gameOver('😎') : ' '
}

function onCellMarked(elCell, i, j) {
  const cell = gBoard[i][j]
  if (!gGame.isOn) return
  if (cell.isRevealed) return

  if (!cell.isMarked) {
    cell.isMarked = true
    elCell.innerHTML = MARK
    gGame.markedCount++
  } else {
    cell.isMarked = false
    elCell.innerHTML = EMPTY
    gGame.markedCount--
  }

  if (cell.isMarked && cell.isMine) {
    checkGameOver() ? gameOver('😎') : ' '
  }

  mineDisplay()
}

function randomMind(board, mineAmount, elCell) {
  var idxI = 0
  var idxJ = 0
  for (var i = 0; i < mineAmount; i++) {
    idxI = getRandomIntInclusive(0, board.length - 1)
    idxJ = getRandomIntInclusive(0, board.length - 1)

    var cell = board[idxI][idxJ]

    if (!cell.isMine && cell !== elCell) cell.isMine = true
    else i--
  }
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (gBoard[i][j].isMine) continue

      findTheNeighbors(gBoard, i, j)
    }
  }
}

function expandeReveal(idxI, idxJ) {
  const cell = gBoard[idxI][idxJ]
  
  if (cell.isMarked) return
  if (cell.isMine) return
  
  const rowIdx = idxI
  const colIdx = idxJ
  
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue
      if (i === rowIdx && j === colIdx) continue
      
      var neighbor = gBoard[i][j]
      
      if (!neighbor.isMine && !neighbor.isRevealed && !neighbor.isMarked) {
        if (!neighbor.minesAroundCount) {
          renderCell(i, j, EMPTY)
        } else {
          renderCell(i, j, neighbor.minesAroundCount)
        }
        neighbor.isRevealed = true
        gGame.revealedCount++
        checkGameOver() ? gameOver('😎') : ' '
      }
    }
  }
}

function exposeAllMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++)
      if (gBoard[i][j].isMine) {
        const elCell = document.querySelector(`.cell-${i}-${j}`)
        elCell.classList.remove('hide')
        elCell.innerHTML = MINE
      }
  }
}

function checkGameOver() {
  if (
    gGame.revealedCount === gBoard.length ** 2 - gLevel.mine &&
    gGame.markedCount === gLevel.mine
  )
    return true
  else return false
}

function gameOver(msg) {
  gGame.isOn = false
  clearInterval(gTimerInterval)
  // var msg = gGame.isVictory ? '😎' : '🤯'
  document.querySelector('.btn').innerHTML = msg
  // openModal(msg)
}


function mineDisplay() {
  const elmine = document.querySelector('p .mine')
  elmine.innerHTML = gLevel.mine - gGame.markedCount
}

function timerDisplay() {
  const elTimer = document.querySelector('p .timer')
  elTimer.innerHTML = '0.00'
}

function renderBtn() {
  var levels = [4, 8, 12]
  var btns = ` `

  for (var i = 0; i < levels.length; i++) {
    btns += ` <button  data-level=${i} onclick="onChooseTheLevel(this)">${levels[i]} </button>`
  }

  document.querySelector('.buttons').innerHTML = btns
}

function restartDisplay() {
  const elbtn = document.querySelector('.btn')
  elbtn.innerHTML = '😄'
  document.querySelector('.additional-features span').innerText = gGame.lives
}

function livesDisplay(lives) {
  var elLives = document.querySelector('.additional-features span')
  if (gGame.lives === 3) elLives.innerText = '🤎🤎🤎'
  else if (gGame.lives === 2) elLives.innerText = '🤎🤎'
  else if (gGame.lives === 1) elLives.innerText = '🤎'
  else elLives.innerText = ' '
}
