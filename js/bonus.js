'use strict'
var gBtnId
var gcount = 3

function renderHints() {
  var hint = `Hints: `
  for (var i = 0; i < 3; i++) {
    hint += `<button data-id=${i} onclick="onHint(this)">💡</button>`
  }
  const elHint = document.querySelector('.hints')
  elHint.innerHTML = hint
}

function onHint(elCell) {
  if (!gGame.isOn) return
  if (gGame.revealedCount === 0) return

  gGame.isHint = true
  elCell.style.backgroundColor = 'white'
  gBtnId = elCell
}

function hintMode(neighbor, i, j, elCell) {
  if (neighbor.isMine) {
    renderCell(i, j, MINE)
  } else if (neighbor.minesAroundCount) {
    renderCell(i, j, neighbor.minesAroundCount)
  } else renderCell(i, j, EMPTY)

  setTimeout(() => {
    renderCellHint(i, j, EMPTY)
    elCell.innerHTML = EMPTY
    elCell.classList.add('hide')
    gGame.isHint = false
    gBtnId.style.display = 'none'
  }, 1500)
}

function onSafeClick() {
  if (!gcount) return
  if (!gGame.isOn)return
  var safeCells = []

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      const cell = gBoard[i][j]
      if (!cell.isRevealed && !cell.isMine) {
        //  cell = {i,j}
        safeCells.push({ i, j })
      }
    }
  }
  console.log(safeCells)
  const idx = getRandomIntInclusive(0, safeCells.length - 1)

  const safeCell = safeCells.splice(idx, 1)[0]

  const elCell = document.querySelector(`.cell-${safeCell.i}-${safeCell.j}`)
  elCell.style.border = '5px solid white'
  setTimeout(() => {
    elCell.style.border = ' 1px solid #100d0d'
  }, 1500)

  gcount--
  document.querySelector('.safeClick').innerHTML = gcount
}
