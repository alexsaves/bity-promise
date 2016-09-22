/**
 * A simple promise class
 * @param success Function
 * @param failure Function (optional)
 * @param expire_timeout Number (optional)
 * @constructor
 */
var Promise = function (success, failure, expire_timeout) {
  this.success = success;
  this.failure = failure;
  this.promises = {};
  this._signaled = false;
  this.expire_timeout = parseInt(expire_timeout);
  this.statuses = {
    pending: 1,
    broken: 2,
    resolved: 3
  };
  if (!isNaN(this.expire_timeout)) {
    this._expireTimer = setTimeout(function (ctx) {
      return function () {
        for (var prom in ctx.promises) {
          if (ctx.promises[prom] === ctx.statuses.pending) {
            ctx.promises[prom] = ctx.statuses.broken;
          }
          ctx._check();
        }
      };
    }(this), this.expire_timeout);
  }
};

/**
 * Make a promise
 * @param name String
 */
Promise.prototype.make = function (name) {
  if (name instanceof Array) {
    for (var i = 0; i < name.length; i++) {
      this.make(name[i]);
    }
  } else {
    this.promises[name] = this.statuses.pending;
  }
};

/**
 * Break a promise
 * @param name String
 */
Promise.prototype.break = function (name) {
  this.promises[name] = this.statuses.broken;
  this._check();
};

/**
 * Resolve a promise
 * @param name String
 */
Promise.prototype.resolve = function (name) {
  this.promises[name] = this.statuses.resolved;
  this._check();
};

/**
 * Check our promises
 * @private
 */
Promise.prototype._check = function () {
  if (this._signaled) {
    return;
  }
  var hasfailure = false,
    isincomplete = false;

  for (var prom in this.promises) {
    if (this.promises[prom] === this.statuses.pending) {
      isincomplete = true;
    }
    if (this.promises[prom] === this.statuses.broken) {
      hasfailure = true;
    }
  }

  if (!isincomplete) {
    this._signaled = true;
    if (this._expireTimer) {
      clearTimeout(this._expireTimer);
    }
    // Handle it
    if (hasfailure) {
      // Failed
      if (this.failure) {
        this.failure(this);
      }
    } else {
      // Passed
      if (this.success) {
        this.success(this);
      }
    }
  }
};

// Expose it
module.exports = Promise;