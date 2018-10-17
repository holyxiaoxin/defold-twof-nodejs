const _ = require('lodash')
const Victor = require('victor')

class MapLayout {
  // size: pixel, width: in size unit, height: in size unit
  constructor(size, width, height) {
    this.size = size
    this.width = width
    this.height = height
  }

  isValidPosition(position) {
    return (position.x < (this.size * this.width)) && (position.y < (this.size * this.height))
  }

  sameTile(position1, position2) {
    const centerP1 = this.posCenterTile(position1)
    const centerP2 = this.posCenterTile(position2)
    return _.isEqual(centerP1, centerP2)
  }

  getNearestTile(fromPosition, toPosition) {
    const deltaX = this.center(toPosition.x) - this.center(fromPosition.x)
    const deltaY = this.center(toPosition.y) - this.center(fromPosition.y)
    const res = this.posCenterTile(fromPosition)

    if (deltaX !== 0 || deltaY !== 0) {
      if (Math.abs(deltaX) === Math.abs(deltaY) || Math.abs(deltaX) > Math.abs(deltaY)) {
        res.x = this.center(fromPosition.x) + (deltaX > 0 ? 1 : -1) * this.size
      } else {
        res.y = this.center(fromPosition.y) + (deltaY > 0 ? 1 : -1) * this.size
      }
    }

    return res
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

  nextDirection(fromPosition, toPosition) {
    const deltaX = toPosition.x - fromPosition.x
    const deltaY = toPosition.y - fromPosition.y

    return Victor.fromObject({ x: deltaX, y: deltaY }).normalize().toObject()
  }
}

module.exports = MapLayout
