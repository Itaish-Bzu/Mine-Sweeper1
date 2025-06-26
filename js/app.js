'use strict'

const MINE = '💣'
const MARK = '🚩'
const EMPTY = ' '

var gBoard
var gTimerInterval
var gStartTime
var gLevel = {
  size: 4,
  mine: 2,
}

var gGame = {
  isOn: false,
  revealedCount: 0,
  markedCount: 0,
  secsPassed: 0,
  isVictory: false,
  lives: 3,
}

function onInit() {
  gGame.isOn = true
  gBoard = buildBoard()
  // console.table(gBoard)
  renderBoard(gBoard, '.board')
  mineDisplay()
}

function buildBoard() {
  //   const size = 4
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

function onCellClicked(elCell, i, j) {
  const cell = gBoard[i][j]

  if (cell.isRevealed) return
  if (!gGame.isOn) return
  if (cell.isMarked) return

  cell.isRevealed = true
  gGame.revealedCount++
  elCell.classList.remove('hide')

  if (gGame.revealedCount === 1) {
    startTimer()
    firstClick()
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
    document.querySelector('.additional-features span').innerText = gGame.lives
    if (gGame.lives === 0) {
      elCell.classList.remove('hide')
      gameOver()
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

  if (checkGameOver()) {
    gGame.isVictory = true
    gameOver()
  }
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

  mineDisplay()
  console.log(gGame.markedCount)
}

function randomMind(board, mineAmount) {
  for (var i = 0; i < mineAmount; i++) {
    var idxI = getRandomIntInclusive(0, gLevel.mine)
    var idxJ = getRandomIntInclusive(0, gLevel.mine)
    // console.log(idxI, idxJ)
    const cell = board[idxI][idxJ]
    if (!cell.isRevealed && !cell.isMine) cell.isMine = true
  }
}

function firstClick() {
  gBoard[2][2].isMine = true
  gBoard[1][1].isMine = true
  // randomMind(gBoard, gLevel.mine)
  setMinesNegsCount(gBoard)

  return gBoard
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      //   console.log(i,j);
      if (gBoard[i][j].isMine) continue

      findTheNeighbors(gBoard, i, j)
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

function expandeReveal(idxI, idxJ) {
  const cell = gBoard[idxI][idxJ]
  if (cell.isMine) return
  const rowIdx = idxI
  const colIdx = idxJ

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue
      if (i === rowIdx && j === colIdx) continue

      var neighbor = gBoard[i][j]

      if (!neighbor.isMine && !neighbor.isRevealed) {
        if (!neighbor.minesAroundCount) {
          renderCell(i, j, EMPTY)
        } else {
          renderCell(i, j, neighbor.minesAroundCount)
        }
        neighbor.isRevealed = true
        gGame.revealedCount++
      }
    }
  }
}

function gameOver() {
  gGame.isOn = false
  clearInterval(gTimerInterval)
  var msg = gGame.isVictory ? '😎' : '🤯'
  document.querySelector('.btn').innerHTML = msg
  // openModal(msg)
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

function mineDisplay() {
  const elmine = document.querySelector('p .mine')
  elmine.innerHTML = gLevel.mine - gGame.markedCount
}
