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

// test NATS by using features exposed by the plugin
// in corporate networks could not work, due to some firewall (blocking) policies

// const assert = require('assert').strict
const t = require('tap')
const test = t.test
const Fastify = require('fastify')
const fastifyNats = require('../')
const fastifyNatsOptions = {
  enableDefaultNATSServer: true, // sample, to connect by default to public demo server
  drainOnClose: true // sample, to drain last messages at plugin close
  // natsOptions: natsOpts // sample, but not needed with current settings
}

const natsOpts = {
  servers: process.env.NATS_SERVER_URL || 'nats://demo.nats.io:4222'
}
console.log(`NATS demo server (public) URL: ${natsOpts.servers}`)

test('fastify.nats should connect to default (demo) NATS server', t => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on plugin with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    const fastify = Fastify()
    t.teardown(fastify.close.bind(fastify))

    fastify.register(fastifyNats, fastifyNatsOptions)
    t.comment('configure the plugin with only some override to its default options, and connects to NATS demo server')

    fastify.ready((err) => {
      t.error(err)
      t.ok(fastify.hasDecorator('NATS'))
      t.ok(fastify.NATS)
      t.ok(fastify.hasDecorator('nc'))
      t.ok(fastify.nc)
      t.end()
    })
  }
})

test('fastify.nats should connect to the specified NATS server', t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.register(fastifyNats, {
    natsOptions: natsOpts
  })
  t.comment(`configure the plugin with custom options, NATS servers is: ${natsOpts.servers}`)

  fastify.ready((err) => {
    t.error(err)
    t.ok(fastify.hasDecorator('NATS'))
    t.ok(fastify.NATS)
    t.ok(fastify.hasDecorator('nc'))
    t.ok(fastify.nc)
    t.end()
  })
})

test('fastify.nats should work if default (demo) NATS server has been enabled (forced here), and no URL provided', t => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on plugin with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    const fastify = Fastify()
    t.teardown(fastify.close.bind(fastify))

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
      t.end()
    })
  }
})

test('fastify.nats should not work if default (demo) NATS server has not been enabled and no URL provided', (t) => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on plugin with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    const fastify = Fastify()
    t.teardown(fastify.close.bind(fastify))

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

      t.end()
    })
  }
})
