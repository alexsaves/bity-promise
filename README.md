bity-promise
===================
Super simple promises with timeout expiration for Node
###Installation &nbsp;  [![npm version](https://badge.fury.io/js/bity-promise.svg)](http://badge.fury.io/js/bity-promise)
```sh
npm install bity-promise
```
The constructor takes three arguments, but only the success callback is required:
```javascript
new Promise(successCallback, failCallbackOptional, timoutMSOptional)
```
Three methods are available, `make(name)`, `break(name)`, and `resolve(name)`.
###Simple Usage
```javascript
var promise = require("bity-promise");

var p = new promise(function() {
    console.log("success!");
}, function() {
    console.log("some promises broken");
}, 10000);

p.make("promiseA");
p.make("promiseB");
p.make(["promiseC", "promiseD"]);

p.break("promiseA");
p.resolve("promiseB");
```