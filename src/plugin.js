'use strict'

const fp = require('fastify-plugin')
const NATS = require('nats')

const defaultNATSServerURL = 'nats://demo.nats.io:4222'

function fastifyNats (fastify, options, next) {
  const {
    disableDefaultNATSServer = false,
    url = null
  } = options

  const opts = {}
  if (url === null || url.length < 1) {
    if (disableDefaultNATSServer === false) {
      opts.url = defaultNATSServerURL
    } else {
      throw new Error('Must specify NATS Server URL, the default one is disabled')
    }
  } else {
    opts.url = url
  }

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
  fastify: '^1.1.0',
  name: 'fastify-nats-client'
})
