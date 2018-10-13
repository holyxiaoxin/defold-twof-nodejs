const Player = require('./Player')
const MapLayout = require('./MapLayout')

const { nonEnumerable } = require('./utils')
const { playerDt, updateRate } = require('./config')

class BattleState {
  constructor(clock) {
    this.players = {}
    this.layout = new MapLayout(32, 20, 17)
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
    const threshold = playerDt + 1

    // exit condition: we teleport players to touch point on last mile
    if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
      this.movePlayerTo(id, { x, y })
      this.intervals[id].clear()
      return
    }

    const moveDir = this.layout.nextDirection(this.getPlayer(id), this.layout.posCenterTile(position))

    this.movePlayerBy(id, { x: moveDir.x * playerDt, y: moveDir.y * playerDt })
  }

  startMoveInterval(id, position) {
    if (!this.layout.isValidPosition(position)) return

    if (this.intervals[id]) {
      this.intervals[id].clear()
    }

    this.intervals[id] = this.clock.setInterval(() => {
      const centerTile = this.layout.posCenterTile(position)
      this.runMoveInterval(id, centerTile)
    }, updateRate)
  }
}

module.exports = BattleState
