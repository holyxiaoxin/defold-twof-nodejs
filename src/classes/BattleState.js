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

  setPlayerFinalPosition(id, position) {
    this.getPlayer(id).setFinalPosition(position)
  }

  getPlayerFinalPosition(id) {
    return this.getPlayer(id).getFinalPosition()
  }

  clearPlayerFinalPosition(id) {
    this.getPlayer(id).clearFinalPosition()
  }

  runMoveInterval(id, positions) {
    const position = positions[0]
    const { x, y } = position
    const deltaX = x - this.getPlayerPosition(id).x
    const deltaY = y - this.getPlayerPosition(id).y
    const threshold = playerDt + 1

    // exit condition: we teleport players to touch point on last mile
    if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
      this.movePlayerTo(id, { x, y })

      if (positions.length <= 1) { // done
        this.clearPlayerFinalPosition(id)
        this.intervals[id].clear()
      } else {
        this.intervals[id].clear()
        this._startMovePlayerInterval(id, positions.slice(1, positions.length))
      }

      return
    }

    const moveDir = this.layout.nextDirection(this.getPlayerPosition(id), this.layout.posCenterTile(position))

    this.movePlayerBy(id, { x: moveDir.x * playerDt, y: moveDir.y * playerDt })
  }

  _startMovePlayerInterval(id, positions) {
    this.intervals[id] = this.clock.setInterval(() => {
      this.runMoveInterval(id, positions)
    }, updateRate)
  }

  shouldSkipMove(id, position) {
    if (!this.layout.isValidPosition(position)) return true

    // skip unnecessary movements
    if (this.isPlayerMoving(id)) {
      if (this.layout.sameTile(this.getPlayerFinalPosition(id), position)) return true
    } else if (this.layout.sameTile(this.getPlayerPosition(id), position)) {
      return true
    }

    return false
  }

  startMovePlayerInterval(id, position) {
    // validate
    if (this.shouldSkipMove(id, position)) return

    // reset state
    if (this.intervals[id] && this.intervals[id].active) {
      this.clearPlayerFinalPosition(id)
      this.intervals[id].clear()
    }

    // set-up
    this.setPlayerFinalPosition(id, position)
    // we might be halfway moving and got interupted by another startMovePlayerInterval,
    // we want to at least move to nearest tile first
    const nearestTile = this.layout.getNearestTile(this.getPlayerPosition(id), position)
    const centerTileFinalPosition = this.layout.posCenterTile(position)

    // start
    this._startMovePlayerInterval(id, [nearestTile, centerTileFinalPosition])
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
