# Change Log

## [2.2.0](https://github.com/smartiniOnGitHub/fastify-nats-client/releases/tag/2.2.0) (2021-04-06)
[Full Changelog](https://github.com/smartiniOnGitHub/fastify-nats-client/compare/2.1.0...2.2.0)
Summary Changelog:
- Update requirements to latest Fastify 2.x, so currently release '^2.15.3'
- Feature: keep compatibility with Node.js 8 LTS (but this is last release)
- Updated nats library to latest 1.x (next release will use 2.x)
- Update all other dependencies
- Update Tap to latest (major), and remove deprecated calls in tests
- Add JSDoc to generate documentation from sources

## [2.1.0](https://github.com/smartiniOnGitHub/fastify-nats-client/releases/tag/2.1.0) (2019-06-06)
[Full Changelog](https://github.com/smartiniOnGitHub/fastify-nats-client/compare/2.0.0...2.1.0)
Summary Changelog:
- Update all dependencies
- Update Tap to latest, and small changes in tests

## [2.0.0](https://github.com/smartiniOnGitHub/fastify-nats-client/releases/tag/2.0.0) (2019-04-05)
[Full Changelog](https://github.com/smartiniOnGitHub/fastify-nats-client/compare/1.0.0...2.0.0)
Summary Changelog:
- Update requirements to Fastify v2
- Update all dependencies

## [1.0.0](https://github.com/smartiniOnGitHub/fastify-nats-client/releases/tag/1.0.0) (2019-04-05)
Summary Changelog:
- Updated all dependencies
- Note that this release number means that the plugin is stable, 
  and for Fastify v1
- Small updates

## [0.4.0](https://github.com/smartiniOnGitHub/fastify-nats-client/releases/tag/0.4.0) (2019-03-29)
Summary Changelog:
- Use official NATS Server Docker image for some (specific) local tests, 
  and related npm custom commands, all like `docker:nats:start` 
  and the same for `log|process|stop` and maybe others (but later)
- Update dependencies
- Refactor plugin options, and add a new one 'disableDefaultNATSServer' 
  (by default false) to disable connections to default NATS Server, 
  so if no 'url' is provided an Error will be raised
- In Tests and Example, use the env variable 'NATS_SERVER_URL' 
  to set the NATS server to connect, and use it in new npm custom commands
- Improve Tap tests
- No change of callbacks here (in standard format like 
  'function callback (err, data) { }'), because it seems not so useful here

## [0.3.3](https://github.com/smartiniOnGitHub/fastify-nats-client/releases/tag/0.3.3) (2019-01-05)
Summary Changelog:
- Update LICENSE and add NOTICE with the right attributions, 
  to clarify rights of original code

## [0.3.2](https://github.com/smartiniOnGitHub/fastify-nats-client/releases/tag/0.3.2) (2018-12-23)
Summary Changelog:
- Update plugin dependencies: 'fastify-plugin' to '^1.4.0', 'nats' to '^1.2.2'

## [0.3.1](https://github.com/smartiniOnGitHub/fastify-nats-client/releases/tag/0.3.1) (2018-12-09)
Summary Changelog:
- Update plugin dependencies: 'fastify-plugin' to '^1.3.0', 
  and 'nats' to '^1.2.0', so it will be possible to use new driver features 
  like New Authentication (Nkeys and User Credentials)

## [0.3.0](https://github.com/smartiniOnGitHub/fastify-nats-client/releases/tag/0.3.0) (2018-12-06)
Summary Changelog:
- First release of my fork (see in the README for more info)
- At the moment it's not clear the 'fastify-nats' package name at npm, if it will be transferred to me; 
  so this has been released with this (temporary I hope) package name 'fastify-nats-client'
- Update Fastify dependencies to '1.1.0' or higher (but on 1.x)
- Update plugin folder structure for sources, test, examples
- Add an example script for using the plugin, and publishing/subscribing messages
- Add default values in plugin options, for a faster quick start
- Improved tests
- Updated README


----
