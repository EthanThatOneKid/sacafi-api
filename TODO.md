# TODO

## Error while deploying to Heroku
```shell
2020-05-31T09:29:37.284467+00:00 app[web.1]: Error: Invalid mongodb uri. Must begin with "mongodb://"
2020-05-31T09:29:37.284468+00:00 app[web.1]:   Received: mongodb+srv://admin:<password>@cluster0-cod9f.mongodb.net/test?retryWrites=true&w=majority
2020-05-31T09:29:37.284468+00:00 app[web.1]:     at muri (/app/node_modules/muri/lib/index.js:28:11)
2020-05-31T09:29:37.284469+00:00 app[web.1]:     at NativeConnection.Connection.open (/app/node_modules/mongoose/lib/connection.js:221:16)
2020-05-31T09:29:37.284470+00:00 app[web.1]:     at Mongoose.connect (/app/node_modules/mongoose/lib/index.js:241:47)
2020-05-31T09:29:37.284470+00:00 app[web.1]:     at Object.<anonymous> (/app/app.js:42:12)
2020-05-31T09:29:37.284471+00:00 app[web.1]:     at Module._compile (internal/modules/cjs/loader.js:1138:30)
2020-05-31T09:29:37.284471+00:00 app[web.1]:     at Object.Module._extensions..js (internal/modules/cjs/loader.js:1158:10)
2020-05-31T09:29:37.284471+00:00 app[web.1]:     at Module.load (internal/modules/cjs/loader.js:986:32)
2020-05-31T09:29:37.284472+00:00 app[web.1]:     at Function.Module._load (internal/modules/cjs/loader.js:879:14)
2020-05-31T09:29:37.284472+00:00 app[web.1]:     at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:71:12)
2020-05-31T09:29:37.284473+00:00 app[web.1]:     at internal/main/run_main_module.js:17:47
2020-05-31T09:29:37.284473+00:00 app[web.1]: Emitted 'error' event on NativeConnection instance at:
2020-05-31T09:29:37.284473+00:00 app[web.1]:     at NativeConnection.Connection.error (/app/node_modules/mongoose/lib/connection.js:443:8)
2020-05-31T09:29:37.284474+00:00 app[web.1]:     at NativeConnection.Connection.open (/app/node_modules/mongoose/lib/connection.js:223:12)
2020-05-31T09:29:37.284474+00:00 app[web.1]:     at Mongoose.connect (/app/node_modules/mongoose/lib/index.js:241:47)
2020-05-31T09:29:37.284475+00:00 app[web.1]:     [... lines matching original stack trace ...]
2020-05-31T09:29:37.284475+00:00 app[web.1]:     at internal/main/run_main_module.js:17:47
```