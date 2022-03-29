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

const fp = require('fastify-plugin')
const NATS = require('nats')

const defaultNATSServerURL = 'nats://demo.nats.io:4222'

// TODO: check if async plugin is good for Fastify 2.x (current plugin) and 3.x ... wip
// TODO: document the new option natsOptions ... wip
async function fastifyNats (fastify, options, next) {
  const {
    disableDefaultNATSServer = false, // TODO: check if rename in enable (by default false) ... wip
    natsOptions = {}
  } = options

  if (natsOptions.servers === null || natsOptions.servers.length < 1) {
    if (disableDefaultNATSServer === false) {
      natsOptions.servers = defaultNATSServerURL
    } else {
      throw new Error(`Must specify NATS Server/s URL, the default one (${defaultNATSServerURL}) is disabled`)
    }
  }

  const nats = await NATS.connect(natsOptions)

  nats.on('connect', (nc) => {
    fastify.decorate('nats', nats)
    fastify.addHook('onClose', async (instance, done) => {
      await nats.flush()
      await nats.close()
      done()
    })

    next()
  })

  nats.on('error', (err) => {
    next(err)
  })
}

module.exports = fp(fastifyNats, {
  fastify: '^2.12.0',
  name: 'fastify-nats-client'
})
