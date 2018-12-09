'use strict'

const fp = require('fastify-plugin')
const NATS = require('nats')

const opts = {
  url: 'nats://demo.nats.io:4222'
}

function fastifyNats (fastify, options, next) {
  opts.url = options.url || opts.url

  const nats = NATS.connect(opts)

  nats.on('connect', (nc) => {
    fastify.decorate('nats', nats)
    fastify.addHook('onClose', (instance, done) => {
      instance.nats.close()
      done()
    })

    next()
  })

  nats.on('error', (err) => {
    next(err)
  })
}

module.exports = fp(fastifyNats, {
  fastify: '1.x',
  name: 'fastify-nats-client'
})
