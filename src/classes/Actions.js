const uuidv1 = require('uuid/v1')
const { ACTION_SPELL } = require('../constants')
const { nonEnumerable } = require('../utils')

class Actions {
  constructor(clock) {
    this.data = {}
    nonEnumerable(this, 'clock', clock)
  }

  addPlayer(id) {
    this.data[id] = []
  }

  addSpell(fromId, toId, type, position, opt = {}) {
    const { duration = 0 } = opt
    const uuid = uuidv1()
    const action = {
      uuid,
      type: ACTION_SPELL,
      removable: true,
      position,
      duration,
      from: fromId,
      to: toId,
    }

    this.data[fromId].push(action)
    this.data[toId].push(action)
  }

  removeSpell(id, uuid) {
    const index = this.data[id].findIndex(a => a.uuid === uuid)
    if (~index && this.data[id][index].removable) this.data[id].splice(index, 1)
  }
}

module.exports = Actions
