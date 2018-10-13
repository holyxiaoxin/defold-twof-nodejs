class Player {
  constructor() {
    this.x = 240
    this.y = 240
  }

  moveTo(position) {
    this.x = parseFloat(position.x)
    this.y = parseFloat(position.y)
  }

  moveBy(position) {
    this.x += parseFloat(position.x)
    this.y += parseFloat(position.y)
  }
}

module.exports = Player
