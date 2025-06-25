'use strict'

const MINE = '💣'
// const EMPTY = ' '

var gBoard
var gLevel = {
  size: 4,
  mine: 2,
}

var gGame = {
  isOn: false,
  revealedCount: 0,
  markedCount: 0,
  secsPassed: 0,
  clickCounter: 0,
  lives: 3,
}

function onInit() {
  gGame.isOn = true
  gBoard = buildBoard()
  // console.table(gBoard)
  renderBoard(gBoard, '.board')
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
  //const cell = gboard[i][j]
  const cell = gBoard[i][j]

  if (cell.isRevealed) return
  elCell.classList.remove('hide')

  if (gGame.clickCounter === 0) {
    cell.isRevealed = true
    firstClick()
    gGame.clickCounter++
    return
  }

  if (!cell.isRevealed) {
    elCell.innerText = cell.minesAroundCount
    cell.isRevealed = true
  }

  if (cell.isMine) {
    gGame.lives--
    if (gGame.lives === 0) {
      console.log('game over')
      gameOver()
    }

    elCell.innerText = MINE
    document.querySelector('.additional-features span').innerText = gGame.lives
    setTimeout(() => {
      elCell.classList.add('hide')
      elCell.innerText = EMPTY
      cell.isRevealed = false
    }, 500)

    // console.log(cell);
  }
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
  gBoard[1][1].isMine = true
  gBoard[2][2].isMine = true
  // randomMind(gBoard, gLevel.mine)
  setMinesNegsCount(gBoard)

  return gBoard
}

function findTheNeighbors(board, idxI, idxJ) {
  const cell = board[idxI][idxJ]

  const rowIdx = idxI
  const colIdx = idxJ

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === rowIdx && j === colIdx) continue

      var neighbor = board[i][j]

      if (neighbor.isMine) cell.minesAroundCount++
    }
  }
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

function gameOver() {
  document.querySelector('.additional-features .btn').innerHTML = '☠️'
}

function ExposeTheNeighbor(pos) {
  // const cell = gBoard[i][j]

  const rowIdx = pos.i
  const colIdx = pos.j

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === rowIdx && j === colIdx) continue

      var neighbor = gBoard[i][j]

      if (neighbor.minesAroundCount === 0) {
        neighbor.isRevealed = true
        // renderCell(pos, EMPTY)

      }
    }
  }
}
