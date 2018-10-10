const http = require("http")
const { Server, Room } = require("colyseus")

// Create HTTP & WebSocket servers
const gameServer = new Server({
  server: http.createServer()
});

const speed = 100 / 1000
const updateRate = 16.6666
// const updateRate = 200

class ChatRoom extends Room {
  // maximum number of clients per active session
  constructor() {
    super()
    this.maxClients = 2
    console.log('construct')
  }

  onInit () {
    console.log('onInit')
    this.setState({
      messages: [],
      players: {},
    })
    this.intervals = {}
  }

  onLeave(client, consented) {
    const message = `${ client.id } left.`
    console.log(message)
    this.state.messages.push(message)
  }

  onJoin (client) {
    const message = `${ client.id } joined.`
    console.log(message)
    this.state.messages.push(message)
    this.state.players[client.id] = {
      x: 240,
      y: 240,
    }
    this.intervals[client.id] = null
  }

  moveTo(client, x, y) {
    console.log(this.state.players[client.id])

    const delta_x = x - this.state.players[client.id].x
		const delta_y = y - this.state.players[client.id].y
		const diagonal_threshold = 10

    console.log(delta_x, delta_y)

    // exit if reached threshold
    if (Math.abs(delta_x) < diagonal_threshold && Math.abs(delta_y) < diagonal_threshold) {
      return clearInterval(this.intervals[client.id])
    }

    const moveDir = { x: 0, y: 0, z: 0 }

    if (Math.abs(Math.abs(delta_x) - Math.abs(delta_y)) < diagonal_threshold) {
      if (delta_x > 0) {
        moveDir.x = 1
      } else {
        moveDir.x = -1
      }

      if (delta_y > 0) {
        moveDir.y = 1
      } else {
        moveDir.y = -1
      }
    } else if (Math.abs(delta_x) > Math.abs(delta_y)) {
      if (delta_x > 0) {
        moveDir.x = 1
      } else {
        moveDir.x = -1
      }
    } else {
      if (delta_y > 0) {
        moveDir.y = 1
      } else {
        moveDir.y = -1
      }
    }
    console.log(moveDir)

    // TODO: normalise?
    const dt = speed * updateRate
    this.state.players[client.id].x += moveDir.x * dt
    this.state.players[client.id].y += moveDir.y * dt
  }

  onMessage (client, data) {
    // console.log(data)
    // TODO: this slows down alot for big data
    // this.state.messages.push(data)
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

// Register ChatRoom as "chat"
gameServer.register("chat", ChatRoom)
gameServer.listen(2657);
