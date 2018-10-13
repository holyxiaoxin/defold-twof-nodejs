const Victor = require('victor')

const Player = require('./Player')
const { nonEnumerable } = require('./utils')
const { playerMoveSpeed, updateRate } = require('./config')

class BattleState {
  constructor(clock) {
    this.players = {}
    nonEnumerable(this, 'intervals', {})
    nonEnumerable(this, 'clock', clock)
  }

  addPlayer(id) {
    this.players[id] = new Player()
  }

  getPlayer(id) {
    return this.players[id]
  }

  movePlayerTo(id, position) {
    this.players[id].moveTo(position)
  }

  movePlayerBy(id, position) {
    this.players[id].moveBy(position)
  }

  runMoveInterval(id, position) {
    // console.log(this.players[id])
    const { x, y } = position
    const deltaX = x - this.getPlayer(id).x
    const deltaY = y - this.getPlayer(id).y
    const dt = playerMoveSpeed * updateRate
    const threshold = 1 * dt + 1

    // exit condition: we teleport players to touch point on last mile
    if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
      this.movePlayerTo(id, { x, y })
      this.intervals[id].clear()
      return
    }

    let moveDir = { x: 0, y: 0 }

    if (Math.abs(Math.abs(deltaX) - Math.abs(deltaY)) < threshold) {
      // threshold is within diagonal, move left and right at the same time
      moveDir.x = deltaX > 0 ? 1 : -1
      moveDir.y = deltaY > 0 ? 1 : -1
    } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // touch more horizontal than vertical, so move horizontal first
      moveDir.x = deltaX > 0 ? 1 : -1
    } else {
      // touch more vertical than horizontal, so move vertical first
      moveDir.y = deltaY > 0 ? 1 : -1
    }

    moveDir = Victor.fromObject(moveDir).normalize().toObject()

    this.movePlayerBy(id, { x: moveDir.x * dt, y: moveDir.y * dt })
  }

  startMoveInterval(id, position) {
    if (this.intervals[id]) {
      this.intervals[id].clear()
    }

    this.intervals[id] = this.clock.setInterval(() => {
      this.runMoveInterval(id, position)
    }, updateRate)
  }
}

module.exports = BattleState
