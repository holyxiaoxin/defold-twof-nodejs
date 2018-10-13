const Player = require('./Player')

class BattleState {
  constructor() {
    this.players = {}
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
}

module.exports = BattleState
