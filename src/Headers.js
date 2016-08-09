var support = require('./support')

function Headers(headers) {
    this.map = {}
    if (headers instanceof Headers) {
        headers.forEach(function (value, name) {
            this.append(name, value)
        }, this)

    } else if (headers) {
        for (var name in headers) {
            if (headers.hasOwnProperty(name)) {
                this.append(name, headers[name])
            }
        }

    }
}

Headers.prototype.append = function (name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
        list = []
        this.map[name] = list
    }
    list.push(value)
}

Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)]
}

Headers.prototype.get = function (name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
}

Headers.prototype.getAll = function (name) {
    return this.map[normalizeName(name)] || []
}

Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name))
}

Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
}

Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
        if (this.map.hasOwnProperty(name)) {
            this.map[name].forEach(function (value) {
                callback.call(thisArg, value, name, this)
            }, this)
        }
    }
}

Headers.prototype.keys = function () {
    var items = []
    this.forEach(function (value, name) {
        items.push(name)
    })
    return iteratorFor(items)
}

Headers.prototype.values = function () {
    var items = []
    this.forEach(function (value) {
        items.push(value)
    })
    return iteratorFor(items)
}

Headers.prototype.entries = function () {
    var items = []
    this.forEach(function (value, name) {
        items.push([name, value])
    })
    return iteratorFor(items)
}

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

function normalizeName(name) {
    if (typeof name !== 'string') {
        name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
}

function normalizeValue(value) {
    if (typeof value !== 'string') {
        value = String(value)
    }
    return value
}

module.exports = Headers