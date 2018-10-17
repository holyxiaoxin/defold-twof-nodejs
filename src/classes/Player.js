class Player {
  constructor() {
    this.position = { x: 240, y: 240 }
    this.hp = 10
  }

  moveTo(position) {
    this.position.x = parseFloat(position.x)
    this.position.y = parseFloat(position.y)
  }

  moveBy(position) {
    this.position.x += parseFloat(position.x)
    this.position.y += parseFloat(position.y)
  }
}

module.exports = Player
