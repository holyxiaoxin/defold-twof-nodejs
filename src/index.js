const http = require('http')
const { Server, Room } = require('colyseus')

const BattleState = require('./classes/BattleState')
const { patchRate } = require('./config')

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
    this.setPatchRate(patchRate)
  }

  onInit() {
    console.info('onInit')
    this.setState(new BattleState(this.clock))

    // // for debugging
    // const botId = 'bot'
    // this.state.addPlayer(botId)
  }

  onLeave(client, _consented) {
    const message = `${client.id} left.`
    console.info(message)
    // clean up
  }

  onJoin(client) {
    const message = `${client.id} joined.`
    console.info(message)
    this.state.addPlayer(client.id)
  }

  onMessage(client, data) {
    const { type } = data
    switch (type) {
      case 'move_player': {
        this.state.startMovePlayerInterval(client.id, data.position)
        break
      }
      case 'attack_player': {
        const opponentId = Object.keys(this.state.players).find(id => id !== client.id)
        if (opponentId) {
          this.state.attackPlayer(client.id, opponentId, data.position)
        }
        break
      }
      case 'clear_action': {
        this.state.removeAction(client.id, data.uuid)
        break
      }
      default:
    }
    // const [x, y] = data.split('_')
  }
}

// Register ChatRoom as "common", should use playerid1-playerid2
gameServer.register('common', ChatRoom)
gameServer.listen(2657)
