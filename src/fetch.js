var Request = require('./Request')
var Response = require('./Response')
var Headers = require('./Headers')
var Transport = require('./Transport')

if (![].forEach) {
    Array.prototype.forEach = function (fn, scope) {
        'use strict'
        var i, len
        for (i = 0, len = this.length; i < len; ++i) {
            if (i in this) {
                fn.call(scope, this[i], i, this)
            }
        }
    }
}
if (!'司徒正美'.trim) {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
    String.prototype.trim = function () {
        return this.replace(rtrim, '')
    }
}
function headers(xhr) {
    var head = new Headers()
    if (xhr.getAllResponseHeaders) {
        var headerStr = xhr.getAllResponseHeaders() || ''
        if (/\S/.test(headerStr)) {
            //http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
            var headerPairs = headerStr.split('\u000d\u000a');
            for (var i = 0; i < headerPairs.length; i++) {
                var headerPair = headerPairs[i];
                // Can't use split() here because it does the wrong thing
                // if the header value has the string ": " in it.
                var index = headerPair.indexOf('\u003a\u0020')
                if (index > 0) {
                    var key = headerPair.substring(0, index).trim()
                    var value = headerPair.substring(index + 2).trim()
                    head.append(key, value)
                }
            }
        }
    }
    return head
}
function fetch(input, init) {
    return new Promise(function (resolve, reject) {
        var request
        if (!init && (init instanceof Request)) {
            request = input
        } else {
            request = new Request(input, init)
        }
     

        var xhr = new Transport(request)
        function responseURL() {
            if ('responseURL' in xhr) {
                return xhr.responseURL
            }
            // Avoid security warnings on getResponseHeader when not allowed by CORS
            if (xhr.getResponseHeader && /^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
                return xhr.getResponseHeader('X-Request-URL')
            }

            return
        }

        xhr.on('load', function (event) {
            var options = {
                status: event.status,
                statusText: event.statusText,
                headers: headers(event),
                url: responseURL()
            }
            var body = 'response' in event ? event.response : event.responseText
            resolve(new Response(body, options))
        })
        xhr.on('error', function () {
            reject(new TypeError('Network request failed'))
        })
        xhr.on('timeout', function () {
            reject(new TypeError('Network request timeout'))
        })

        xhr.open(request.method, request.url, true)

        request.headers.forEach(function (value, name) {
            xhr.setRequestHeader(name, value)
        })

        xhr.send(typeof request._body === 'undefined' ? null : request._body)
    })
}
function notFunc(a){
  return  !/\scode\]\s+\}$/.test(a)
}
if (notFunc(window.fetch)) {
    window.fetch = fetch
}
if (typeof avalon === 'function') {
    avalon.fetch = fetch
}
module.exports = fetch