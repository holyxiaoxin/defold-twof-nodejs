const Player = require('./Player')
const MapLayout = require('./MapLayout')
const Actions = require('./Actions')

const { ACTION_SPELL } = require('../constants')
const { nonEnumerable } = require('../utils')
const { playerDt, updateRate } = require('../config')

class BattleState {
  constructor(clock) {
    this.players = {}
    this.layout = new MapLayout(32, 20, 17)
    this.actions = new Actions(clock)
    nonEnumerable(this, 'intervals', {})
    nonEnumerable(this, 'clock', clock)
  }

  addPlayer(id) {
    this.players[id] = new Player()
    this.actions.addPlayer(id)
  }

  getPlayer(id) {
    return this.players[id]
  }

  getPlayerPosition(id) {
    return this.getPlayer(id).position
  }

  movePlayerTo(id, position) {
    this.getPlayer(id).moveTo(position)
  }

  movePlayerBy(id, position) {
    this.getPlayer(id).moveBy(position)
  }

  isPlayerMoving(id) {
    return this.getPlayer(id).isMoving()
  }

  runMoveInterval(id, position) {
    const { x, y } = position
    const deltaX = x - this.getPlayerPosition(id).x
    const deltaY = y - this.getPlayerPosition(id).y
    const threshold = playerDt + 1

    // exit condition: we teleport players to touch point on last mile
    if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
      this.movePlayerTo(id, { x, y })
      this.intervals[id].clear()

      return
    }

    const moveDir = this.layout.nextDirection(this.getPlayerPosition(id), position)

    this.movePlayerBy(id, { x: moveDir.x * playerDt, y: moveDir.y * playerDt })
  }

  _startMovePlayerInterval(id, position) {
    this.intervals[id] = this.clock.setInterval(() => {
      this.runMoveInterval(id, position)
    }, updateRate)
  }

  shouldSkipMove(id, position) {
    if (!this.layout.isValidPosition(position)) return true

    return false
  }

  startMovePlayerInterval(id, position) {
    // validate
    if (this.shouldSkipMove(id, position)) return

    // reset state
    if (this.intervals[id] && this.intervals[id].active) {
      this.intervals[id].clear()
    }

    // set-up
    this._startMovePlayerInterval(id, position)
  }

  attackPlayer(fromId, toId, position) {
    if (this.layout.sameTile(this.getPlayerPosition(toId), position)) {
      this.actions.addSpell(fromId, toId, ACTION_SPELL, this.layout.posCenterTile(position))
    }
  }

  removeAction(id, uuid) {
    this.actions.removeSpell(id, uuid)
  }
}

module.exports = BattleState
