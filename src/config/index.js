const playerMoveSpeed = 400 / 1000
const _60fps = 16.6666
// update slightly faster than the patchRate
const updateRate = _60fps - 1

module.exports = { playerMoveSpeed, updateRate }
