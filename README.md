# fastify-nats-client

  [![NPM Version](https://img.shields.io/npm/v/fastify-nats-client.svg?style=flat)](https://npmjs.org/package/fastify-nats-client/)
  [![NPM Downloads](https://img.shields.io/npm/dm/fastify-nats-client.svg?style=flat)](https://npmjs.org/package/fastify-nats-client/)
  [![Code Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
  [![Coverage Status](https://coveralls.io/repos/github/smartiniOnGitHub/fastify-nats-client/badge.svg?branch=master)](https://coveralls.io/github/smartiniOnGitHub/fastify-nats-client/?branch=master)
  [![dependencies Status](https://david-dm.org/smartiniOnGitHub/fastify-nats-client/status.svg)](https://david-dm.org/smartiniOnGitHub/fastify-nats-client)
  [![devDependencies Status](https://david-dm.org/smartiniOnGitHub/fastify-nats-client/dev-status.svg)](https://david-dm.org/smartiniOnGitHub/fastify-nats-client?type=dev)

Fastify Plugin to use [NATS](http://nats.io) Server as a queue, to exchange messages.

Under the hood [Node NATS](https://github.com/nats-io/node-nats) client is used, the options that you pass to `register` will be passed to the nats client.


## Usage
Add it to you project with `register` and you are done!  
You can access the *nats Connection* via `fastify.nats`.
```js
const fastify = require('fastify')

fastify.register(require('fastify-nats-client'), {
  url: 'nats://demo.nats.io:4222'
}, err => {
  if (err) throw err
})

fastify.listen(3000, (err, address) => {
  if (err) throw err
  console.log(`server listening on ${address}`)
})
```

and later
```js
fastify.nats.publish(topic, message);
```


## Requirements

Fastify ^1.1.0 , Node.js 8.15.x or later.


## Note

All the code here is base on the work done by its original author (mahmed8003 <mahmed8003@gmail.com>), 
in the upstream repository [fastify-nats](https://github.com/mahmed8003/fastify-nats), under the MIT license.

The plugin decorate Fastify and expose some functions:
- `nats`, the NATS Connection to use

Plugin options are forwarder to [Node NATS](https://github.com/nats-io/node-nats) client, some are:
- `url`, the absolute URL of the NATS Server to use (including the port)

all plugin options are optional, and have a default value set in the plugin.

Default `url` for NATS Server in the plugin is set to `nats://demo.nats.io:4222`, 
to be able to do a quick start; anyway note that in some cases it could not be reachable 
(for example by corporate firewall rules), so even plugin tests could fail in that case.
To perform some local tests, it's possible to use a NATS Server Docker image from standard image 
[NATS - DockerHub](https://hub.docker.com/_/nats/); 
for convenience, they are defined in `package.json` like `docker:nats:start` 
and the same for `log|process|stop` etc.


## License

Licensed under [MIT](./LICENSE).

----
