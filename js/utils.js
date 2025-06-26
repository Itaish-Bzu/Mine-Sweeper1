'use strict'


function renderBoard(mat, selector) {
  var strHTML = '<table><tbody>'
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < mat[0].length; j++) {
      const cell = mat[i][j]
      const className = 'cell cell-' + i + '-' + j

    strHTML += `<td class="${className} hide" onclick="onCellClicked(this,${i}, ${j})" 
    oncontextmenu = "onCellMarked(this,${i}, ${j})">`

      strHTML += `${EMPTY}`
      strHTML += `</td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elContainer = document.querySelector(selector)
  elContainer.innerHTML = strHTML
}


function renderCell( i,j, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${i}-${j}`)
  elCell.innerHTML = value
  elCell.classList.remove('hide')
}

function createMat(ROWS, COLS) {
  const mat = []
  for (var i = 0; i < ROWS; i++) {
    const row = []
    for (var j = 0; j < COLS; j++) {
      row.push('')
    }
    mat.push(row)
  }
  return mat
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

function startTimer() {
  gStartTime = Date.now()
  gTimerInterval = setInterval(updateTimer, 100)
}

function updateTimer() { 
  const now = Date.now()
  gGame.secPassed = (now - gStartTime) / 1000
  document.querySelector('p .timer').innerText = gGame.secPassed.toFixed(2)
}


function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
