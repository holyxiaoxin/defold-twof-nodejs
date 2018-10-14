class Player {
  constructor() {
    this.position = { x: 240, y: 240 }
    this.finalPosition = { x: null, y: null }
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

  setFinalPosition(position) {
    this.finalPosition.x = position.x
    this.finalPosition.y = position.y
  }

  getFinalPosition() {
    return this.finalPosition
  }

  isMoving() {
    return this.finalPosition.x !== null && this.finalPosition.y !== null
  }

  clearFinalPosition() {
    this.finalPosition = { x: null, y: null }
  }
}

module.exports = Player
