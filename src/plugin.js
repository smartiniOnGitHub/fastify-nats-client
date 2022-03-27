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
  fastify: '^2.12.0',
  name: 'fastify-nats-client'
})
