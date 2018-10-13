const { playerDt } = require('./config')

class MapLayout {
  // size: pixel, width: in size unit, height: in size unit
  constructor(size, width, height) {
    this.size = size
    this.width = width
    this.height = height
  }

  center(point) {
    return this.size * (parseInt(point / this.size, 10) + 0.5)
  }

  posCenterTile(position) {
    return {
      x: this.center(position.x),
      y: this.center(position.y),
    }
  }

  // move center of tile from tile to tile (no diagonal)
  nextDirection(fromPosition, toPosition) {
    const fromUnitX = fromPosition.x
    const fromUnitY = fromPosition.y
    const toUnitX = this.center(toPosition.x)
    const toUnitY = this.center(toPosition.y)

    const deltaX = toUnitX - fromUnitX
    const deltaY = toUnitY - fromUnitY

    // special case, when we have to decide between going vertical or horizontal
    // since we delibrately can't move diagonal
    if (Math.abs(Math.abs(deltaX) - Math.abs(deltaY)) < this.size) {
      const threshold = playerDt + 1
      const _deltaX = toPosition.x - fromPosition.x
      const _deltaY = toPosition.y - fromPosition.y
      // x-y equidistant, move horizontal first,
      if (Math.abs((Math.ceil(Math.abs(_deltaY) / this.size) * this.size) - Math.abs(_deltaX)
        < (this.size - threshold))) {
        return { x: deltaX > 0 ? 1 : -1, y: 0 }
      }
      // then vertical
      return { x: 0, y: deltaY > 0 ? 1 : -1 }
    }

    // touch much more horizontal than vertical, so move horizontal first
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return { x: deltaX > 0 ? 1 : -1, y: 0 }
    }

    // touch much more vertical than horizontal, so move vertical first
    return { x: 0, y: deltaY > 0 ? 1 : -1 }
  }
}

module.exports = MapLayout
