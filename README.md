# fastify-nats-client

  [![NPM Version](https://img.shields.io/npm/v/fastify-nats-client.svg?style=flat)](https://npmjs.org/package/fastify-nats-client/)
  [![NPM Downloads](https://img.shields.io/npm/dm/fastify-nats-client.svg?style=flat)](https://npmjs.org/package/fastify-nats-client/)
  [![Code Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
  [![Coverage Status](https://coveralls.io/repos/github/smartiniOnGitHub/fastify-nats-client/badge.svg?branch=master)](https://coveralls.io/github/smartiniOnGitHub/fastify-nats-client/?branch=master)
  [![license - MIT](https://img.shields.io/npm/l/fastify-nats-client.svg)](http://opensource.org/licenses/MIT)

Fastify Plugin to use [NATS](http://nats.io) Server as a queue, to exchange messages.

Under the hood [Node NATS](https://github.com/nats-io/node-nats) client is used, the options that you pass to `register` will be passed to the nats client.


## Usage
Add it to you project with `register` and you are done!  
You can access the *nats Connection* via `fastify.nats`.
```js
const fastify = require('fastify')

// register the plugin with some options, for example:
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

Fastify ^2.15.3 , Node.js 10 LTS (10.13.0) or later 
(required by NATS libraries for js).

Note that plugin releases 2.x are for Fastify 2.x, 3.x are for Fastify 3.x, etc.


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
- `nats`, the NATS Connection to use

Some plugin options are sent directly to 
[NATS.js - NATS-io - GitHub](https://github.com/nats-io/node-nats) library, like:
- `natsOptions`, general connetion options for the NATS Server, 
  see [Changed configuration properties - NATS.js](https://github.com/nats-io/nats.js/blob/main/migration.md#changed-configuration-properties)
while others are only used inside the plugin, to configure its behavior, like:
- `disableDefaultNATSServer`, flag (by default false) to disable connections 
  to default NATS Server (so if a NATS server is not specified, 
  an Error will be raised);
  could be useful to avoid connections to that (external and public) server, 
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

Licensed under [MIT](./LICENSE).

----
