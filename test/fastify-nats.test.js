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
}

const natsOpts = {
  servers: process.env.NATS_SERVER_URL || 'nats://demo.nats.io:4222'
}
console.log(`NATS demo server (public) URL: ${natsOpts.servers}`)

test('fastify.nats should connect to default NATS server', t => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on plugin with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    const fastify = Fastify()
    t.teardown(fastify.close.bind(fastify))

    fastify.register(fastifyNats, fastifyNatsOptions)
    t.comment('configure the plugin with its default options, and connects to NATS demo server')

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

/*
test('fastify.nats should connect to the specified NATS server', t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.register(fastifyNats, {
    // TODO: use natsOpts ...
  })
  t.comment(`configure the plugin with custom options, so NATS server URL is: ${natsOpt.url}`)

  fastify.ready((err) => {
    t.error(err)
    t.ok(fastify.hasDecorator('NATS'))
    t.ok(fastify.NATS)
    t.ok(fastify.hasDecorator('nc'))
    t.ok(fastify.nc)
    t.end()
  })
})

test('fastify.nats should work if default NATS server has not been disabled (default, but forced here), and no URL provided', t => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on plugin with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    const fastify = Fastify()
    t.teardown(fastify.close.bind(fastify))

    t.comment('configure the plugin with custom options, do not disable Default NATS Server (same as default)')
    fastify.register(fastifyNats, {
      disableDefaultNATSServer: false
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
*/
