var Headers = require('./Headers')
var Body = require('./Body')

function Response(bodyInit, options) {
    if (!options) {
        options = {}
    }

    this.type = 'default'

    this.status = options.status
    if (1223 === this.status) {
        this.status = 204
    }
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
}

var F = function(){} 
F.prototype = Body.prototype 
Response.prototype = new F() 

Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
        status: this.status,
        statusText: this.statusText,
        headers: new Headers(this.headers),
        url: this.url
    })
}

Response.error = function () {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
}

var redirectStatuses = [301, 302, 303, 307, 308]

Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
        throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
}

module.exports = Response