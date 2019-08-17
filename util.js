const fs = require('fs')

module.exports = {
  handleStudentData,
  getStudentObject,
  deleteStudentObject,
  checkStudentDataAvailability,
  getStudentParams
}

function handleStudentData (id, keys, value) {
  let avKeys = checkStudentDataAvailability(id, keys)
  if (avKeys) {
    const student = requireUncached(`./data/${id}`)
    const arr = keys.slice()
    arr.splice(arr.indexOf(avKeys[0]))
    let stKey = getNestedObject(student, arr)
    assignNestedKeys(stKey, avKeys, value)
    fs.writeFileSync(`./data/${id}.json`, JSON.stringify(student, null, 2))
    return student
  }
  const student = {}
  assignNestedKeys(student, keys, value)
  fs.writeFileSync(`./data/${id}.json`, JSON.stringify(student, null, 2))
  return student
}

function getStudentObject (id, keys) {
  try {
    const student = requireUncached(`./data/${id}.json`)
    const arr = keys.slice()
    return arr.reduce((obj, key) => {
      if (obj && key in obj) {
        return obj[key]
      }
      throw new Error('Not Found')
    }, student)
  } catch (error) {
    throw new Error('Not Found')
  }
}

function deleteStudentObject (id, keys) {
  try {
    const student = requireUncached(`./data/${id}.json`)
    const arr = keys.slice()
    arr.reduce((obj, key, i) => {
      if (obj && key in obj) {
        if (i === arr.length - 1) delete obj[key]
        return obj[key]
      }
      throw new Error('Not Found')
    }, student)
    return student
  } catch (error) {
    throw new Error('Not Found')
  }
}
function requireUncached (module) {
  delete require.cache[require.resolve(module)]
  return require(module)
}

function getStudentParams (params, body) {
  const { studentId } = params
  const studentProporties = params[0].split(/\//)
  Object.keys(body)[0] && studentProporties.push(Object.keys(body)[0])
  const value = body[Object.keys(body)[0]]
  return { studentId, studentProporties, value }
}

function getNestedObject (nestedObj, pathArr) {
  return pathArr.reduce(
    (obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined),
    nestedObj
  )
}

function checkStudentDataAvailability (id, keys) {
  try {
    const student = requireUncached(`./data/${id}.json`)
    const arr = keys.slice()
    return arr.reduce((obj, key, i) => {
      if (obj && key in obj && i !== arr.length - 1) {
        return obj[key]
      }
      return arr.splice(i)
    }, student)
  } catch (error) {
    return false
  }
}

function assignNestedKeys (obj, keys, value) {
  const lastKeyIndex = keys.length - 1
  keys.map((key, i) => {
    if (i !== lastKeyIndex) {
      obj[key] = {}
      obj = obj[key]
    }
  })
  obj[keys[lastKeyIndex]] = value || {}
}
