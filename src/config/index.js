const playerMoveSpeed = 200 / 1000
const _60fps = 16.6666
// update slightly faster than the patchRate
const updateRate = _60fps - 1
const playerDt = playerMoveSpeed * updateRate

module.exports = { playerMoveSpeed, updateRate, playerDt }
