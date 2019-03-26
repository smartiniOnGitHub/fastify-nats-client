'use strict'

const t = require('tap')
const test = t.test
const Fastify = require('fastify')
const fastifyNats = require('../')

const natsOpt = {
  url: process.env.NATS_SERVER_URL || 'nats://demo.nats.io:4222'
}

test('fastify.nats should connect to default NATS server', t => {
  if (process.env.NATS_SERVER_URL) {
    t.plan(1)
    t.comment('skipped test on plugin with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    t.plan(3)

    const fastify = Fastify()
    t.tearDown(fastify.close.bind(fastify))

    fastify.register(fastifyNats)
    t.comment('configure the plugin with its default options, and connects to NATS demo server')

    fastify.ready((err) => {
      t.error(err)
      t.ok(fastify.hasDecorator('nats'))
      t.ok(fastify.nats)
    })
  }
})

test('fastify.nats should connect to the specified NATS server', t => {
  t.plan(3)

  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))

  fastify.register(fastifyNats, natsOpt)
  t.comment(`configure the plugin with custom options, so NATS server URL is: ${natsOpt.url}`)

  fastify.ready((err) => {
    t.error(err)
    t.ok(fastify.hasDecorator('nats'))
    t.ok(fastify.nats)
  })
})
