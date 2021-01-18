function groupBy(get) {
  return (acc,x) => {
    acc = acc || {}
    const by = get(x)
    const list = acc[by] || []
    acc[by] = [x, ...list]
    return acc
  }
}

// Array.prototype.groupBy = function (getter) {
//   arguments[0] = () => groupBy(getter)
//   return reduce(...arguments)
// }

// Object.prototype.let = function(f) {return f(this)}
// Object.prototype.also = function(f) {f(this); return this}

//usage
//{a: "A"}.copy({a: 'B'}) => {a: 'B'}
//{a: "A"}.copy(old => ({a: old.a + "C"})) => {a: 'AC'}
function copy(obj, update) {
  if (!update) return Object.assign({}, this)
  if (typeof update === 'function') update = update(obj)//update function to update object
  return Object.assign({}, obj, update)
}

export {groupBy, copy}
