'use strict'

function renderBoard(mat, selector) {
  var strHTML = '<table><tbody>'
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < mat[0].length; j++) {
      const cell = mat[i][j]
      const className = 'cell cell-' + i + '-' + j

      strHTML += `<td class="${className}" onclick="onCellClicked(this,${i}, ${j})">`

    //  if (cell.isMine){
    //     strHTML += `💣`
    //  }else if (cell.minesAroundCount){
    //   strHTML += `${cell.minesAroundCount}`
    //  }
      strHTML += `</td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elContainer = document.querySelector(selector)
  elContainer.innerHTML = strHTML
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = value
}

function findEmptyPos() {
  //  emptyPos ={i: 2, j: 7}
  const emptyPositions = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      const cell = gBoard[i][j]
      if (cell === EMPTY) {
        const pos = { i, j }
        emptyPositions.push(pos)
      }
    }
  }

  if (emptyPositions.length === 0) return null
  const randIdx = getRandomIntInclusive(0, emptyPositions.length - 1)
  const emptyPos = emptyPositions[randIdx]
  return emptyPos
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

function showNeighbors() {
  const rowIdx = gGamerPos.i
  const colIdx = gGamerPos.j

  var ballCounter = 0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      if (i === rowIdx && j === gGamerPos.j) continue
      var cell = gBoard[i][j]

      if (cell.gameElement === BALL) ballCounter++
    }
  }
  document.querySelector('.neighbor').innerText = ballCounter
}
//************************************** */
function startTimer() {
  gStartTime = Date.now()
  gTimerInterval = setInterval(updateTimer, 25)
  // console.log(' gTimerInterval:', gTimerInterval)
}

function updateTimer() {
  const now = Date.now()
  //* Taking the difference between current time and start time
  //* and converting to seconds
  const diff = (now - gStartTime) / 1000
  document.querySelector('.timer span').innerText = diff.toFixed(3)
}
//**************************************************** */
