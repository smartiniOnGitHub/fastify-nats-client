# fastify-nats-client

  [![NPM Version](https://img.shields.io/npm/v/fastify-nats-client.svg?style=flat)](https://npmjs.org/package/fastify-nats-client/)
  [![NPM Downloads](https://img.shields.io/npm/dm/fastify-nats-client.svg?style=flat)](https://npmjs.org/package/fastify-nats-client/)
  [![Code Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
  [![license - APACHE-2.0](https://img.shields.io/npm/l/fastify-nats-client.svg)](http://opensource.org/licenses/APACHE-2.0)

Fastify Plugin to use [NATS](http://nats.io) Server to exchange messages via queues etc.

Under the hood [nats.js](https://github.com/nats-io/nats.js) library is used; 
the plugin has some options (to set in the `register`), 
some will be sent to the nats library for connection details etc.


## Usage
Add it to you project with `register` and you are done!  
You can access the *nats Connection* via `fastify.nc`.
Note that even the *NATS library* is exposed at `fastify.NATS` but only 
as a convenience (to avoid refer to it directly as a Node.js library).
```js
const fastify = require('fastify')

// register the plugin with some options, for example:
fastify.register(require('fastify-nats-client'), {
  natsOptions: { servers: 'nats://demo.nats.io:4222' }
})

fastify.listen({ port: 3000, host: 'localhost' }, (err, address) => {
  if (err) throw err
  console.log(`server listening on ${address}`)
})
```

and later
```js
// get some NATS-related facilities
const nc = fastify.nc // get the NATS Connection with servers
const sc = fastify.NATS.StringCodec() // codec for a string message
const jc = fastify.NATS.JSONCodec() // codec for a JSON string message
// const subject = fastify.NATS.createInbox() // sample queue name
// publish/subscribe, example
nc.publish(queueName, sc.encode(msg)) // simple publisher for a string message
nc.publish(queueName, jc.encode(obj)) // simple publisher for a JSON message
nc.subscribe( ... ) // use an async iterator or a callback
// etc ...
```

In the [example](./example/) folder there is a simple server scripts that
uses the plugin (inline but it's the same using it from npm registry).

As you can see, the NATS.js library is complex and with a lot of features, 
please refer to its documentation and sources for more info and examples.


## Requirements

Fastify ^5.0.0 , Node.js 20 LTS (20.9.0) or later.
Note that plugin releases 4.x are for Fastify 4.x, 5.x for Fastify 5.x, etc.


## Sources

Source code is all inside main repo:
[fastify-nats-client](https://github.com/smartiniOnGitHub/fastify-nats-client).

Documentation generated from source code (library API):
[here](https://smartiniongithub.github.io/fastify-nats-client/).


## Note

All the code here is based on the work done initially by its original author 
(mahmed8003 <mahmed8003@gmail.com>), in the upstream repository 
[fastify-nats](https://github.com/mahmed8003/fastify-nats), under the MIT license.

The plugin decorate Fastify and expose some functions:
- `NATS`, a reference to the NATS library, but only as a convenience
- `nc`, the NATS Connection to use; 
  even if a little criptic, I used those names to better align with NATS.js sources and examples

Some plugin options are sent directly to 
[NATS.js - NATS-io - GitHub](https://github.com/nats-io/node-nats) library, like:
- `natsOptions`, general connetion options for the NATS Server, 
  see [Changed configuration properties - NATS.js](https://github.com/nats-io/nats.js/blob/main/migration.md#changed-configuration-properties)
while others are only used inside the plugin, to configure its behavior, like:
- `drainOnClose`, flag (by default false) to enable the drain of 
  last data from the NATS connection when the plugin has to close 
- `enableDefaultNATSServer`, flag (by default false) to enable connections 
  to public NATS Demo Server (so if a NATS server is not specified 
  and this flag is disabled an Error will be raised), 
  useful for a fast start on tests and examples;
  default setting is to avoid connections to that (external and public) server, 
  for example by plugin configuration mistake

all plugin options are optional and have a default value set in the plugin.

Default NATS Server in the plugin is set to the public demo NATS Server 
`nats://demo.nats.io:4222`, to be able to do a quick start; 
anyway note that in some cases it could not be reachable 
(for example by corporate firewall rules), so even plugin tests could fail 
in that case.
To perform some local tests, it's possible to use a NATS Server Docker image from 
standard image [NATS - DockerHub](https://hub.docker.com/_/nats/); 
for convenience, they are defined in `package.json` like `docker:nats:start` 
and the same for `log|process|stop` etc.


## License

Licensed under [Apache-2.0](./LICENSE).

----
