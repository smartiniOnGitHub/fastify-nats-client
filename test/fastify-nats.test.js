/*
 * Copyright 2018-2024 the original author or authors.
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

// test NATS by using features exposed by the plugin
// in corporate networks could not work, due to some firewall (blocking) policies
// so to skip connection with default (demo) NATS server,
// some tests here are skipped when the env var NATS_SERVER_URL is defined

const assert = require('assert').strict
const t = require('tap')
const test = t.test
const Fastify = require('fastify')
const fastifyNats = require('../')
const fastifyNatsOptions = {
  enableDefaultNATSServer: true, // sample, to connect by default to public demo server
  drainOnClose: true // sample, to drain last messages at plugin close
  // natsOptions: k.natsOptions // sample, but not needed with current settings
}

const hostname = require('os').hostname()

const pluginName = require('../package.json').name // get plugin name
const pluginVersion = require('../package.json').version // get plugin version
const k = {}
// k.serverUrl = `${k.protocol}://${k.address}:${k.port}/`

k.natsDemoServer = 'nats://demo.nats.io:4222'
k.natsOptions = {
  // servers: k.natsDemoServer // same as plugin default, so no ned to specify here
  servers: process.env.NATS_SERVER_URL || k.natsDemoServer // use from env var, or use the same as plugin default
  // servers: process.env.NATS_SERVER_URL // use from env var, or use NATS demo if plugin option is enabled
}
k.queueName = `${pluginName}-${pluginVersion}`
k.message = `Hello World, from a Fastify web application just started at '${hostname}'!`

console.log(`Environment variable NATS_SERVER_URL: ${process.env.NATS_SERVER_URL}`)
console.log(`NATS server URL to connect: ${k.natsOptions.servers}`)

// subscribe to an hardcoded queue (subject) with the given nats connection
// and get a text message, then unsubscribe after 1 message (if enabled)
// it must be an async function
async function subscribe (nc, dec) {
  console.log(`Subscribe to the queue '${k.queueName}'`)
  assert(nc !== null)
  assert(dec !== null)

  // example iterator subscription
  const sub = nc.subscribe(k.queueName, {
    // max: 1 // after 1 message, auto-unsubscribe from the subject
  })
  for await (const m of sub) {
    const decoded = dec.decode(m.data)
    console.log(`Message received from async iterator, decoded: '${decoded}'`)
  }
}

// publish a text message in the given nats connection
// the queue (subject) is hardcoded
// it's an async function, but it's not mandatory
async function publish (nc, msg = '', enc) {
  console.log(`Publish message in the queue '${k.queueName}'`)
  assert(nc !== null)
  assert(enc !== null)
  nc.publish(k.queueName, enc.encode(msg))
}

// some info about tests if/when skipped
if (process.env.NATS_SERVER_URL) {
  console.log(`Note:
some tests here are skipped because the env var NATS_SERVER_URL is defined,
useful for example to avoid connection errors with default (demo) NATS server
that in corporate networks could not work, due to some firewall (blocking) policies
----`)
}

test('fastify.nats should connect to default (demo) NATS server', t => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on plugin with its default options (which connects to NATS demo server)')
    t.end()
    return
  }
  // else
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })

  fastify.register(fastifyNats, fastifyNatsOptions)
  t.comment('configure the plugin with only some override to its default options, and connects to NATS demo server')

  fastify.ready((err) => {
    t.error(err)
    t.ok(fastify.hasDecorator('NATS'))
    t.ok(fastify.NATS)
    t.ok(fastify.hasDecorator('nc'))
    t.ok(fastify.nc)
    console.log(`connected to ${fastify.nc.getServer()}`)

    // subscribe to a queue and publish a message to it, as a sample
    subscribe(fastify.nc, fastify.NATS.StringCodec())
    publish(fastify.nc, k.message, fastify.NATS.StringCodec())

    t.end()
  })
})

test('fastify.nats should connect to the specified NATS server', t => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })

  fastify.register(fastifyNats, {
    natsOptions: k.natsOptions
  })
  t.comment(`configure the plugin with custom options, NATS servers is: ${k.natsOptions.servers}`)

  fastify.ready((err) => {
    t.error(err)
    t.ok(fastify.hasDecorator('NATS'))
    t.ok(fastify.NATS)
    t.ok(fastify.hasDecorator('nc'))
    t.ok(fastify.nc)
    console.log(`connected to ${fastify.nc.getServer()}`)

    // subscribe to a queue and publish a message to it, as a sample
    subscribe(fastify.nc, fastify.NATS.StringCodec())
    publish(fastify.nc, k.message, fastify.NATS.StringCodec())

    t.end()
  })
})

test('fastify.nats should work if default (demo) NATS server has been enabled (forced here), and no URL provided', t => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on plugin with its default options (which connects to NATS demo server)')
    t.end()
    return
  }
  // else
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })

  t.comment('configure the plugin with custom options, enable default NATS Server (override default setting)')
  fastify.register(fastifyNats, {
    enableDefaultNATSServer: true
  })

  fastify.ready((err) => {
    t.error(err)
    t.ok(fastify.hasDecorator('NATS'))
    t.ok(fastify.NATS)
    t.ok(fastify.hasDecorator('nc'))
    t.ok(fastify.nc)
    console.log(`connected to ${fastify.nc.getServer()}`)
    t.end()
  })
})

test('fastify.nats should not work if default (demo) NATS server has not been enabled and no URL provided', (t) => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on plugin with settings that does not work')
    t.end()
    return
  }
  // else
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })

  t.comment('configure the plugin with only default options, do not enable default NATS Server (same as default)')
  fastify.register(fastifyNats, {
    // enableDefaultNATSServer: false // same as default
  // })
  // optional, add even some tests in the after
  // all works even without these tests, but it's a good example
  // note that here I need to make this error fatal, see at the end of code block
  }).after((err, instance, done) => {
    // console.log('error: ' + err)
    t.ok(err) // expect an error here
    // if (err) throw err // not here
    // done() // discard the error in the plugin and continue execution
    done(err) // fatal error, do not discard
  })

  fastify.ready((err) => {
    // console.log('error: ' + err)
    t.ok(err) // expect an error here
    t.pass()

    t.notOk(fastify.hasDecorator('NATS'))
    t.notOk(fastify.NATS)
    t.notOk(fastify.hasDecorator('nc'))
    t.notOk(fastify.nc)
    t.throws(function () {
      // console.log(`connected to ${fastify.nc.getServer()}`)
      t.notOk(fastify.nc.getServer())
      assert(fastify.nc === null) // never executed
    }, Error, 'Expected exception because no connection')

    t.end()
  })
})
