/*
 * Copyright 2018-2022 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict'

const assert = require('assert').strict
const hostname = require('os').hostname()
const fastify = require('fastify')({
  logger: true
})
// const NATS = require('nats')

const pluginName = require('../package.json').name // get plugin name
const pluginVersion = require('../package.json').version // get plugin version
const k = {
  protocol: 'http',
  address: '0.0.0.0',
  port: 3000,
}
// k.serverUrl = `${k.protocol}://${k.address}:${k.port}/`

k.natsDemoServer ='nats://demo.nats.io:4222'
k.natsOptions = {
  // servers: k.natsDemoServer // same as plugin default, so no ned to specify here
  servers: process.env.NATS_SERVER_URL || k.natsDemoServer // use from env var, or use the same as plugin default
}
k.queueName = `${pluginName}-${pluginVersion}`
k.message = `Hello World, from a Fastify web application just started at '${hostname}'!`

// register plugin with all its options (as a sample)
fastify.register(require('../src/plugin'), {
  // disableDefaultNATSServer: true, // sample, enable for a quick test here
  natsOptions: k.natsOptions
})
fastify.after((err) => {
  if (err) {
    console.log(err)
  }
  assert(fastify.NATS !== null) // example
  assert(fastify.nc !== null) // example
  if (fastify.nc !== null) {
    console.log(`Connected to the queue at: '${k.natsOptions.servers}'`)
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
  publish(fastify.nc, `Hello World, from the root page of a Fastify web application at '${hostname}'!`)
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
  assert(fastify.NATS !== null)
  assert(fastify.nc !== null)
  subscribe(fastify.nc)
  publish(fastify.nc, 'Plugin ready')
})

// subscribe to an hardcoded queue (subject) with the given nats connection
// and get a text message, then unsubscribe after 1 message (if enabled)
function subscribe (nc,
  cb = function (err, msg) {
    console.log(`Received message: (${err}, ${msg})`)
    if (err) {
      console.error(err.message)
    } else {
      const sc = fastify.NATS.StringCodec() // codec for a string message
      console.log(`Message received, decoded: '${sc.decode(msg.data)}'`)
    }
  }) {
  console.log(`Subscribe to the queue '${k.queueName}'`)
  assert(nc !== null)
  // simple subscriber with a callback
  nc.subscribe(k.queueName, cb, {
    // max: 1 // after 1 message, auto-unsubscribe from the subject
  })
}

// publish a text message in the given nats connection
// the queue (subject) is hardcoded
function publish (nc, msg = '') {
  console.log(`Publish message in the queue '${k.queueName}'`)
  assert(nc !== null)
  const sc = fastify.NATS.StringCodec() // codec for a string message
  nc.publish(k.queueName, sc.encode(msg)) // simple publisher
}
