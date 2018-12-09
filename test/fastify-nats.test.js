'use strict'

const t = require('tap')
const test = t.test
const Fastify = require('fastify')
const fastifyNats = require('../')

const natsOpt = {
  url: 'nats://demo.nats.io:4222'
}

test('fastify.nats should connect to default NATS server', t => {
  t.plan(3)

  const fastify = Fastify()
  fastify.register(fastifyNats) // configure this plugin with its default options

  fastify.ready((err) => {
    t.error(err)
    t.ok(fastify.hasDecorator('nats'))
    t.ok(fastify.nats)

    fastify.close()
  })
})

test('fastify.nats should connect to the specified NATS server', t => {
  t.plan(3)

  const fastify = Fastify()

  fastify.register(fastifyNats, natsOpt)

  fastify.ready((err) => {
    t.error(err)
    t.ok(fastify.hasDecorator('nats'))
    t.ok(fastify.nats)

    fastify.close()
  })
})
