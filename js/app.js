'use strict'

const MINE = '💣'
const EMPTY = ' '

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
}

function onInit() {
  gBoard = buildBoard()
  console.table(gBoard)
  renderBoard(gBoard, '.board')
  
}

function buildBoard() {
  const size = 4
  const board = []
  for (var i = 0; i < size; i++) {
    board[i] = []
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: null,
        isRevealed: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  board[1][1].isMine = true
  board[2][2].isMine = true
  setMinesNegsCount(board)

  return board
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      // console.log(i,j);
      findTheNeighbors(board, i, j)
    }
  }
}

function findTheNeighbors(board, idxI, idxJ) {
  const cell = board[idxI][idxJ]
  if (cell.isMine) return
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
  // console.log(cell);
}

