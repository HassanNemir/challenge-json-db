module.exports = {
  storeStudentData,
}

function storeStudentData (req, res, next) {
  const studentParams = util.getStudentParams(req.params, req.body)
  const { studentId, studentProporties, value } = studentParams
  const student = util.handleStudentData(studentId, studentProporties, value)
  res.json(student)
}
}

async function getHealth (req, res, next) {
  res.json({ success: true })
}
