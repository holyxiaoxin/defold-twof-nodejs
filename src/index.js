const http = require('http')
const { Server, Room } = require('colyseus')

const BattleState = require('./BattleState')

// Create HTTP & WebSocket servers
const gameServer = new Server({
  server: http.createServer(),
})

class ChatRoom extends Room {
  // maximum number of clients per active session
  constructor() {
    super()
    console.info('construct')
    // Maximum number of clients allowed to connect into the room.
    // When room reaches this limit, it is locked automatically.
    // Unless the room was explicitly locked by you via lock() method,
    // the room will be unlocked as soon as a client disconnects from it.
    this.maxClients = 2
    // Frequency to send the room state to connected clients (in milliseconds)
    this.setPatchRate(16.6)
  }

  onInit() {
    console.info('onInit')
    this.setState(new BattleState(this.clock))
    this.intervals = {}
  }

  onLeave(client, _consented) {
    const message = `${client.id} left.`
    console.info(message)
  }

  onJoin(client) {
    const message = `${client.id} joined.`
    console.info(message)
    this.state.addPlayer(client.id)
    this.intervals[client.id] = null
  }

  onMessage(client, data) {
    const [x, y] = data.split('_')

    this.state.startMoveInterval(client.id, { x, y })
  }
}

// Register ChatRoom as "common", should use playerid1-playerid2
gameServer.register('common', ChatRoom)
gameServer.listen(2657)
