const tape = require('tape')
const jsonist = require('jsonist')
const fs = require('fs')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('Store Data', async function (t) {
  const data = { firstName: 'Joe' }
  const url = `${endpoint}/s10/name`
  jsonist.put(url, data, (err, body) => {
    if (err) t.error(err)
    t.equal(JSON.stringify(body), '{"name":{"firstName":"Joe"}}')
    t.end()
  })
})

tape('Edit Nested Data', async function (t) {
  const data = { lastName: 'Doe' }
  const url = `${endpoint}/s10/name`
  jsonist.put(url, data, (err, body) => {
    if (err) t.error(err)
    t.equal(
      JSON.stringify(body),
      '{"name":{"firstName":"Joe","lastName":"Doe"}}'
    )
    t.end()
  })
})

tape('Get Data', async function (t) {
  const url = `${endpoint}/s10/name`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.equal(JSON.stringify(body), '{"firstName":"Joe","lastName":"Doe"}')
    t.end()
  })
})

tape('Get Nested Data', async function (t) {
  const url = `${endpoint}/s10/name/firstName`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.equal(JSON.stringify(body), '"Joe"')
    t.end()
  })
})

tape('Get Nested Data Not Found', async function (t) {
  const url = `${endpoint}/s10/name/firstName/hello`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.equal(JSON.stringify(body), '{"error":"Not Found"}')
    t.end()
  })
})

tape('Delete Nested Data', async function (t) {
  const url = `${endpoint}/s10/name/firstName`
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err)
    t.equal(JSON.stringify(body), '{"name":{"lastName":"Doe"}}')
    t.end()
  })
})

tape('Delete Nested Data Not Found', async function (t) {
  const url = `${endpoint}/s10/name/firstName/hello`
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err)
    t.equal(JSON.stringify(body), '{"error":"Not Found"}')
    t.end()
  })
})

tape('Delete Data', async function (t) {
  const url = `${endpoint}/s10/name`
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err)
    t.equal(JSON.stringify(body), '{}')
    t.end()
  })
})

tape('cleanup', function (t) {
  fs.unlinkSync('./data/s10.json')
  server.close()
  t.end()
})
