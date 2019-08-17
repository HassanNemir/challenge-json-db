const util = require('./util')

module.exports = {
  storeStudentData,
  getStudentData,
  deleteStudentData
}

function storeStudentData (req, res, next) {
  const studentParams = util.getStudentParams(req.params, req.body)
  const { studentId, studentProporties, value } = studentParams
  const student = util.handleStudentData(studentId, studentProporties, value)
  res.json(student)
}

function getStudentData (req, res, next) {
  try {
    const studentParams = util.getStudentParams(req.params, req.body)
    const { studentId, studentProporties } = studentParams
    const student = util.getStudentObject(studentId, studentProporties)
    res.json(student)
  } catch (err) {
    res.status(404).send({ error: err.message })
  }
}

function deleteStudentData (req, res, next) {
  try {
    const studentParams = util.getStudentParams(req.params, req.body)
    const { studentId, studentProporties } = studentParams
    const student = util.deleteStudentObject(studentId, studentProporties)
    res.json(student)
  } catch (err) {
    res.status(404).send({ error: err.message })
  }
}
