var Headers = require('./Headers')
var Body = require('./Body')

function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request instanceof input) {
        if (input.bodyUsed) {
            throw new TypeError('Already read')
        }
        this.url = input.url
        this.credentials = input.credentials
        if (!options.headers) {
            this.headers = new Headers(input.headers)
        }
        this.method = input.method
        this.mode = input.mode
        if (!body) {
            body = input._body
            input.bodyUsed = true
        }
    } else {
        this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
        this.headers = new Headers(options.headers)
    }
    this.method = (options.method || this.method || 'GET').upperCase()
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
        throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
}

Request.prototype.clone = function () {
    return new Request(this)
}

Body.call(Request.prototype)

module.exports = Request