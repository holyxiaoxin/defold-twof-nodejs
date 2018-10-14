const playerMoveSpeed = 200 / 1000
// const patchRate = 16.6666
const patchRate = 50
// update slightly faster than the patchRate
const updateRate = patchRate - 1
const playerDt = playerMoveSpeed * updateRate

module.exports = { patchRate, playerMoveSpeed, updateRate, playerDt }
