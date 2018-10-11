const http = require('http')
const { Server, Room } = require('colyseus')
const Victor = require('victor')

// Create HTTP & WebSocket servers
const gameServer = new Server({
  server: http.createServer(),
})

const speed = 200 / 1000
const updateRate = 16.6666
const dt = speed * updateRate
// const updateRate = 200

class ChatRoom extends Room {
  // maximum number of clients per active session
  constructor() {
    super()
    this.maxClients = 2
    console.log('construct')
  }

  onInit() {
    console.log('onInit')
    this.setState({
      players: {},
    })
    this.intervals = {}
  }

  onLeave(client, _consented) {
    const message = `${client.id} left.`
    console.log(message)
  }

  onJoin(client) {
    const message = `${client.id} joined.`
    console.log(message)
    this.state.players[client.id] = { x: 240, y: 240 }
    this.intervals[client.id] = null
  }

  moveTo(client, x, y) {
    console.log(this.state.players[client.id])

    const deltaX = x - this.state.players[client.id].x
    const deltaY = y - this.state.players[client.id].y
    const diagonalThreshold = 10
    const exitThreshold = 1 * dt

    // exit condition: we teleport players to touch point on last mile
    if (Math.abs(deltaX) < exitThreshold && Math.abs(deltaY) < exitThreshold) {
      this.state.players[client.id].x = parseFloat(x)
      this.state.players[client.id].y = parseFloat(y)
      clearInterval(this.intervals[client.id])
      return
    }

    let moveDir = { x: 0, y: 0 }

    if (Math.abs(Math.abs(deltaX) - Math.abs(deltaY)) < diagonalThreshold) {
      // threshold is within diagonal, move left and right at the same time
      moveDir.x = deltaX > 0 ? 1 : -1
      moveDir.y = deltaY > 0 ? 1 : -1
    } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // touch more horizontal than vertical, so move horizontal first
      moveDir.x = deltaX > 0 ? 1 : -1
    } else {
      // touch more vertical than horizontal, so move vertical first
      moveDir.y = deltaY > 0 ? 1 : -1
    }

    moveDir = Victor.fromObject(moveDir).normalize().toObject()

    this.state.players[client.id].x += moveDir.x * dt
    this.state.players[client.id].y += moveDir.y * dt
  }

  onMessage(client, data) {
    // console.log(data)
    const [x, y] = data.split('_')
    // this.state.players[client.id].x = x
    // this.state.players[client.id].y = y

    if (this.intervals[client.id]) {
      clearInterval(this.intervals[client.id])
    }

    this.intervals[client.id] = setInterval(() => {
      this.moveTo(client, x, y)
    }, updateRate)
  }
}

// Register ChatRoom as "common", should use playerid1-playerid2
gameServer.register('common', ChatRoom)
gameServer.listen(2657)
