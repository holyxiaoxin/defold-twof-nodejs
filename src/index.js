const http = require('http')
const { Server, Room } = require('colyseus')
const Victor = require('victor')

const BattleState = require('./BattleState')

// Create HTTP & WebSocket servers
const gameServer = new Server({
  server: http.createServer(),
})

const speed = 400 / 1000
const _60fps = 16.6666
// update at least twice faster than the game engine's update function
const updateRate = _60fps / 3
const dt = speed * updateRate
// const updateRate = 200

class ChatRoom extends Room {
  // maximum number of clients per active session
  constructor() {
    console.log('construct')
    super()
    // Maximum number of clients allowed to connect into the room.
    // When room reaches this limit, it is locked automatically.
    // Unless the room was explicitly locked by you via lock() method,
    // the room will be unlocked as soon as a client disconnects from it.
    this.maxClients = 2
    // Frequency to send the room state to connected clients (in milliseconds)
    this.setPatchRate(16.6)
  }

  onInit() {
    console.log('onInit')
    this.setState(new BattleState())
    this.intervals = {}
  }

  onLeave(client, _consented) {
    const message = `${client.id} left.`
    console.log(message)
  }

  onJoin(client) {
    const message = `${client.id} joined.`
    console.log(message)
    this.state.addPlayer(client.id)
    this.intervals[client.id] = null
  }

  moveTo(client, x, y) {
    // console.log(this.state.players[client.id])

    const deltaX = x - this.state.getPlayer(client.id).x
    const deltaY = y - this.state.getPlayer(client.id).y
    const threshold = 1 * dt + 1

    // exit condition: we teleport players to touch point on last mile
    if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
      this.state.movePlayerTo(client.id, { x, y })
      this.intervals[client.id].clear()
      return
    }

    let moveDir = { x: 0, y: 0 }

    if (Math.abs(Math.abs(deltaX) - Math.abs(deltaY)) < threshold) {
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

    this.state.movePlayerBy(client.id, { x: moveDir.x * dt, y: moveDir.y * dt })
  }

  onMessage(client, data) {
    // console.log(data)
    const [x, y] = data.split('_')

    if (this.intervals[client.id]) {
      this.intervals[client.id].clear()
    }

    this.intervals[client.id] = this.clock.setInterval(() => {
      this.moveTo(client, x, y)
    }, updateRate)
  }
}

// Register ChatRoom as "common", should use playerid1-playerid2
gameServer.register('common', ChatRoom)
gameServer.listen(2657)
