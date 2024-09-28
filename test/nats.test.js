/*
 * Copyright 2022-2024 the original author or authors.
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

// test NATS directly, to check the right way to use it, bypassing the plugin here
// in corporate networks could not work, due to some firewall (blocking) policies

// const assert = require('assert').strict
const t = require('tap')
const test = t.test

const NATS = require('nats')

const natsDemoHost = 'demo.nats.io'
const natsDemoPort = 4222
const natsDemoTlsPort = 4443

const natsOpts = {
  servers: process.env.NATS_SERVER_URL || `nats://${natsDemoHost}:${natsDemoPort}`
}
console.log(`NATS demo server (public) URL: ${natsOpts.servers}`)

async function natsConnectAndClose (natsOptions) {
  const nc = await NATS.connect(natsOptions)
  console.log(`connected to ${nc.getServer()}`)
  await nc.flush()
  await nc.close()
}

test('nats should connect to default NATS server (single server syntax)', async (t) => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on nats with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    natsConnectAndClose({ servers: `${natsDemoHost}` })
  }
  t.end()
})

test('nats should connect to default NATS server specifying default port', async (t) => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on nats with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    natsConnectAndClose({ servers: [`${natsDemoHost}:${natsDemoPort}`] })
  }
  t.end()
})

test('nats should connect to default NATS server using TLS', async (t) => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on nats with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    natsConnectAndClose({ servers: [`${natsDemoHost}:${natsDemoTlsPort}`] })
  }
  t.end()
})

test('nats should connect to default NATS server and send an empty message', async (t) => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on nats with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    const nc = await NATS.connect({ servers: `${natsDemoHost}:${natsDemoPort}` })
    console.log(`connected to ${nc.getServer()}`)
    const subj = NATS.createInbox()
    const mp = NATS.deferred()
    const sub = nc.subscribe(subj)
    const _ = (async () => { //eslint-disable-line
      for await (const m of sub) { //eslint-disable-line
        mp.resolve(m)
        break
      }
    })()
    nc.publish(subj)
    const m = await mp
    t.equal(m.subject, subj)
    t.equal(m.data.length, 0)
    await nc.close()
  }
  t.end()
})

test('nats should connect to default NATS server and send and receive a sample text message', async (t) => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on nats with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    // setup connection and general objects
    const nc = await NATS.connect({ servers: `${natsDemoHost}:${natsDemoPort}` })
    console.log(`connected to ${nc.getServer()}`)
    const sc = NATS.StringCodec() // codec for a string message
    t.pass()

    const subject = 'test_queue' // sample queue name
    let num = 0 // number of the message, to simplify debug/checks

    // publish a message in the queue
    const payload = 'Hello NATS 2.x' // sample message
    const pubopts = {} // publishing options (headers, etc), optional
    nc.publish(subject, sc.encode(String(payload)), pubopts)
    console.log(`Message ${++num} sent to queue '${subject}': '${payload}'`)
    // note that this message is sent to the queue but never read,
    // I think because at the moment there is none subscribed to that subject ...
    t.pass()

    // subscribe, example with a callback
    // (in general not recommended, unless for specific cases)
    nc.subscribe(subject, {
      callback: (err, msg) => {
        console.log(`Message received from callback (${err}, ${msg})`)
        if (err) {
          t.error(err.message)
        } else {
          console.log(`Message received from callback, decoded: '${sc.decode(msg.data)}'`)
          t.pass()
        }
      },
      max: 1 // after 1 message, auto-unsubscribe from the subject
    })

    // deferred publish, example
    setTimeout(() => {
      const msg = 'Hello deferred !'
      nc.publish(subject, sc.encode(msg))
      console.log(`Message ${++num} sent to queue '${subject}': '${msg}'`)
      t.pass()
    })

    // normal publish, example
    nc.publish(subject, sc.encode(String(payload)), pubopts)
    console.log(`Message ${++num} sent to queue '${subject}': '${payload}'`)

    // example iterator subscription
    // note that the code in the async for loop
    // will block until the iterator completes:
    // either from a break/return from the iterator,
    // or an unsubscribe after the message arrives,
    // or (like in this case) an auto-unsubscribe
    //    after the first message is received
    const sub = nc.subscribe(subject, {
      max: 1 // after 1 message, auto-unsubscribe from the subject
    })
    for await (const m of sub) {
      console.log(`Message received from async iterator, decoded: '${sc.decode(m.data)}'`)
    }
    t.pass()

    // flush and close connection
    // await nc.flush()
    // await nc.close()
    // t.pass()
    // or
    // get all messages (even those in-flight) then closes the connection
    await nc.drain()
    t.pass()
  }
  t.end()
})

test('nats should connect to default NATS server and send/receive a sample JSON message', async (t) => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on nats with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    // setup connection and general objects
    const nc = await NATS.connect({ servers: `${natsDemoHost}:${natsDemoPort}` })
    console.log(`connected to ${nc.getServer()}`)
    // const sc = NATS.StringCodec() // codec for a string message
    const jc = NATS.JSONCodec() // codec for a JSON string message
    t.pass()

    // const subject = 'test_queue' // sample queue name
    const subject = NATS.createInbox() // sample queue name
    let num = 0 // number of the message, to simplify debug/checks

    // sample object to send
    const obj = {
      id: 42,
      name: 'obj',
      description: 'Sample Object',
      value: 3.14159,
      enabled: true,
      note: ['Nothing']
    }
    // useful for some additional test and logging
    const objAsJSONString = JSON.stringify(obj)

    // normal publish, example
    // nc.publish(subject, jc.encode(obj))
    // console.log(`Message ${++num} sent to queue '${subject}': '${objAsJSONString}'`)
    // check why this is not consumed by async iterator,
    // as a workaround, add a deferred publish instead
    // deferred publish, example
    setTimeout(() => {
      nc.publish(subject, jc.encode(obj))
      console.log(`Message ${++num} sent to queue '${subject}': '${JSON.stringify(obj)}'`)
      t.pass()
    })

    // example iterator subscription
    const sub = nc.subscribe(subject, {
      max: 1 // after 1 message, auto-unsubscribe from the subject
    })
    // useful for some additional test and logging
    let decodedAsJSONString = null
    for await (const m of sub) {
      const decoded = jc.decode(m.data)
      decodedAsJSONString = JSON.stringify(decoded)
      console.log(`Message received from async iterator, decoded: '${decodedAsJSONString}'`)
    }
    t.pass()
    t.equal(objAsJSONString, decodedAsJSONString)
    t.pass()

    // get all messages (even those in-flight) then closes the connection
    await nc.drain()
    t.pass()
  }
  t.end()
})

test('nats should connect to default NATS server and send/receive/unsubscribe a sample message', async (t) => {
  if (process.env.NATS_SERVER_URL) {
    t.comment('skipped test on nats with its default options (which connects to NATS demo server)')
    t.pass('test skipped, because env var NATS_SERVER_URL is defined')
  } else {
    // setup connection and general objects
    const nc = await NATS.connect({ servers: `${natsDemoHost}:${natsDemoPort}` })
    console.log(`connected to ${nc.getServer()}`)
    const sc = NATS.StringCodec() // codec for a string message
    t.pass()

    const subject = NATS.createInbox() // sample queue name

    // set up a subscription to process a request
    const sub = nc.subscribe(subject, (err, msg) => {
      if (err) {
        t.error(err.message)
      } else {
        console.log(`Message received from callback, decoded: '${sc.decode(msg.data)}'`)
        msg.respond(sc.encode(new Date().toLocaleTimeString()))
        t.pass()
      }
    })

    // publish message/s ...

    // cancel the subscription (unsubscribe), as a sample
    // without arguments the subscription will cancel when the server receives it
    // you can also specify how many messages are expected by the subscription
    sub.unsubscribe() // cancel immediately, once received by the server
    // sub.unsubscribe(1) // cancel after n message/s
    t.pass()

    // don't exit until the client closes
    // await nc.closed()
    // but this doesn't work here
    // or
    // flush and close connection
    await nc.flush()
    await nc.close()
    // or
    // get all messages (even those in-flight) then closes the connection
    // await nc.drain()
    // t.pass() // pass this test
  }
  t.end()
})

// there are many features in NATS.js, see related library and examples ...
