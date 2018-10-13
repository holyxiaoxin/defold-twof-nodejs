// Used in State, for private attributes that you don't want to expose to clients
// See: http://colyseus.io/docs/api-room-state/#private-variables-nosync
// https://github.com/endel/nonenumerable/blob/master/src/index.ts
const nonEnumerable = (context, key, val) => {
  Object.defineProperty(context, key, {
    writable: true,
    enumerable: false,
    configurable: true,
    value: val,
  })
}

module.exports = { nonEnumerable }
