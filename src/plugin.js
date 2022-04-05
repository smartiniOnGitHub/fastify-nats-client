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

// const assert = require('assert').strict
const fp = require('fastify-plugin')
const NATS = require('nats')

const defaultNATSServerURL = 'nats://demo.nats.io:4222'

// async function to wrap NATS-related stuff
async function natsWrapper (fastify, options = {}, natsOptions, next) {
  const nc = await NATS.connect(natsOptions)

  fastify.decorate('NATS', NATS)
  fastify.decorate('nc', nc)

  fastify.addHook('onClose', async (instance, done) => {
    if (options.drainOnClose === true) {
      await nc.drain()
    } else {
      await nc.flush()
      await nc.close()
    }

    done()
  })

  next()
}

function fastifyNats (fastify, options, next) {
  const {
    enableDefaultNATSServer = false,
    // drainOnClose = false, // commented because not used directly here
    natsOptions = {}
  } = options

  if (natsOptions.servers === undefined || natsOptions.servers === null ||
    natsOptions.servers.length < 1) {
    if (enableDefaultNATSServer === true) {
      natsOptions.servers = defaultNATSServerURL
    } else {
      next(new Error(`Must specify NATS Server/s URL, the default one (${defaultNATSServerURL}) is disabled`))
    }
  }

  // wrap NATS-related async stuff
  // simplify in Fastify 3.x, with async plugins available ...
  natsWrapper(fastify, options, natsOptions, next).then(result => {
    fastify.log.info(`NATS async wrapper inside the plugin, received result: ${result}`)
    // assert(fastify.NATS !== null) // to ensure all is good
    // assert(fastify.nc !== null) // to ensure all is good
  }).catch(error => {
    fastify.log.error(`NATS async wrapper inside the plugin, error: ${error}`)
  })
}

module.exports = fp(fastifyNats, {
  fastify: '^2.12.0',
  name: 'fastify-nats-client'
})
