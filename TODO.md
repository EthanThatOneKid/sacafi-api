# TODO

## Error while deploying to Heroku
```shell
2020-05-31T09:49:07.265594+00:00 app[web.1]: (node:23) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
2020-05-31T09:49:07.791222+00:00 app[web.1]: (node:23) UnhandledPromiseRejectionWarning: MongoNetworkError: failed to connect to server [cluster0-shard-00-01-cod9f.mongodb.net:27017] on first connect [MongoNetworkError: connection 5 to cluster0-shard-00-01-cod9f.mongodb.net:27017 closed
2020-05-31T09:49:07.791263+00:00 app[web.1]:     at TLSSocket.<anonymous> (/app/node_modules/mongoose/node_modules/mongodb/lib/core/connection/connection.js:372:9)
2020-05-31T09:49:07.791264+00:00 app[web.1]:     at Object.onceWrapper (events.js:422:26)
2020-05-31T09:49:07.791265+00:00 app[web.1]:     at TLSSocket.emit (events.js:315:20)
2020-05-31T09:49:07.791265+00:00 app[web.1]:     at net.js:674:12
2020-05-31T09:49:07.791266+00:00 app[web.1]:     at TCP.done (_tls_wrap.js:566:7) {
2020-05-31T09:49:07.791266+00:00 app[web.1]:   [Symbol(mongoErrorContextSymbol)]: {}
2020-05-31T09:49:07.791266+00:00 app[web.1]: }]
2020-05-31T09:49:07.791267+00:00 app[web.1]:     at Pool.<anonymous> (/app/node_modules/mongoose/node_modules/mongodb/lib/core/topologies/server.js:438:11)
2020-05-31T09:49:07.791267+00:00 app[web.1]:     at Pool.emit (events.js:315:20)
2020-05-31T09:49:07.791268+00:00 app[web.1]:     at /app/node_modules/mongoose/node_modules/mongodb/lib/core/connection/pool.js:561:14
2020-05-31T09:49:07.791269+00:00 app[web.1]:     at /app/node_modules/mongoose/node_modules/mongodb/lib/core/connection/pool.js:1008:9
2020-05-31T09:49:07.791269+00:00 app[web.1]:     at callback (/app/node_modules/mongoose/node_modules/mongodb/lib/core/connection/connect.js:97:5)
2020-05-31T09:49:07.791270+00:00 app[web.1]:     at /app/node_modules/mongoose/node_modules/mongodb/lib/core/connection/connect.js:124:7
2020-05-31T09:49:07.791270+00:00 app[web.1]:     at _callback (/app/node_modules/mongoose/node_modules/mongodb/lib/core/connection/connect.js:349:5)
2020-05-31T09:49:07.791271+00:00 app[web.1]:     at Connection.errorHandler (/app/node_modules/mongoose/node_modules/mongodb/lib/core/connection/connect.js:365:5)
2020-05-31T09:49:07.791271+00:00 app[web.1]:     at Object.onceWrapper (events.js:422:26)
2020-05-31T09:49:07.791271+00:00 app[web.1]:     at Connection.emit (events.js:315:20)
2020-05-31T09:49:07.791272+00:00 app[web.1]:     at TLSSocket.<anonymous> (/app/node_modules/mongoose/node_modules/mongodb/lib/core/connection/connection.js:370:12)
2020-05-31T09:49:07.791272+00:00 app[web.1]:     at Object.onceWrapper (events.js:422:26)
2020-05-31T09:49:07.791272+00:00 app[web.1]:     at TLSSocket.emit (events.js:315:20)
2020-05-31T09:49:07.791273+00:00 app[web.1]:     at net.js:674:12
2020-05-31T09:49:07.791273+00:00 app[web.1]:     at TCP.done (_tls_wrap.js:566:7)
2020-05-31T09:49:07.791315+00:00 app[web.1]: (node:23) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
```