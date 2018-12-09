'use strict'

const assert = require('assert')
const fastify = require('fastify')()

const pluginName = require('../package.json').name // get plugin name
const pluginVersion = require('../package.json').version // get plugin version
const k = {
  protocol: 'http',
  address: '127.0.0.1',
  port: 3000
}
// k.serverUrl = `${k.protocol}://${k.address}:${k.port}/`
k.queueName = `${pluginName}-${pluginVersion}`
k.message = 'Hello World, from a Fastify web application just started !'

// register plugin with all its options (as a sample)
fastify.register(require('../src/plugin'), {
  // url: 'nats://demo.nats.io:4222' // same as plugin default, so no ned to specify here
})
fastify.after((err) => {
  if (err) {
    console.log(err)
  }
  assert(fastify.nats !== null) // example
  if (fastify.nats !== null) {
    console.log(`Connected to the queue at: '${fastify.nats.currentServer.url.href}'`)
  }
})

// example to handle a sample home request to serve a static page, optional here
fastify.get('/', function (req, reply) {
  const path = require('path')
  const scriptRelativeFolder = path.join(__dirname, path.sep)
  const fs = require('fs')
  const stream = fs.createReadStream(path.join(scriptRelativeFolder, 'home.html'))
  reply.type('text/html; charset=utf-8').send(stream)

  // publish a message in the queue, as a sample
  publish(fastify.nats, 'Hello World, from the root page of a Fastify web application !')
})

fastify.listen(k.port, k.address, (err, address) => {
  if (err) {
    throw err
  }
  console.log(`Server listening on ${address}`)
})

fastify.ready((err) => {
  if (err) {
    throw err
  }
  const routes = fastify.printRoutes()
  console.log(`Available Routes:\n${routes}`)

  // subscribe and publish a message to the queue, as a sample
  assert(fastify.nats !== null)
  subscribe(fastify.nats)
  publish(fastify.nats, k.message)
})

function subscribe (nats,
  cb = function (msg) {
    console.log(`Received message: ${msg}`)
  }) {
  console.log(`Subscribe to messages from the queue '${k.queueName}'`)
  assert(fastify.nats !== null)

  // simple subscriber
  nats.subscribe(k.queueName, cb)
}

function publish (nats, msg = '') {
  console.log(`Publish the given message in the queue '${k.queueName}'`)
  assert(fastify.nats !== null)

  // simple publisher
  nats.publish(k.queueName, msg)
}
