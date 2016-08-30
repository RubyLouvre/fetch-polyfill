var AXO = require('./transports/axo')
var JSONP = require('./transports/jsonp')
var XDR = require('./transports/xdr')
var XHR = require('./transports/xhr')
var msie = 0
if (window.VBArray) {
    msie = document.documentMode || (window.XMLHttpRequest ? 7 : 6)
}

function Transport(request) {
    if (msie === 8 || msie === 9) {
        this.core = new XDR(request)
    } else if (!msie) {
        this.core = new XHR(request)
    } else if (msie <= 7) {
        if (request.credentials === 'include') {
            this.core = new JSONP(request)
        } else {
            this.core = new AXO(request)
        }
    }
}

var p = Transport.prototype
p.on = function (type, fn) {
    this.core.on(type, fn)
}

p.setRequestHeader = function (a, b) {
    if (this.core.setRequestHeader) {
        this.core.setRequestHeader(a, b)
    }
}

p.open = function (a, b, c, d, e) {
    if (this.core.open) {
        this.core.open(a, b, c, d, e)
    }
}

p.send = function (a) {
    if (this.core.send) {
        this.core.send(a)
    }
}

p.abort = function () {
    if (this.core.abort) {
        this.core.abort()
    }
}

module.exports = Transport