var support = require('./support')

function Body() {
    this.bodyUsed = false
}
var p = Body.prototype

'text,blob,formData,json,arrayBuffer'.replace(/\w+/g, function (method) {
    p[method] = function () {
        return consumeBody(this).then(function (body) {
            return convertBody(body, method)
        })
    }
})

p._initBody = function (body) {
    this._body = body
    if (!this.headers.get('content-type')) {
        var a = bodyType(body)
        switch (a) {
            case 'text':
                this.headers.set('content-type', 'text/plain;charset=UTF-8')
                break
            case 'blob':
                if (body && body.type) {
                    this.headers.set('content-type', body.type)
                }
                break
            case 'searchParams':
                this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
                break
        }
    }
}

function consumeBody(body) {
    if (body.bodyUsed) {
        return Promise.reject(new TypeError('Already read'))
    } else {
        body.bodyUsed = true
        return Promise.resolve(body._body)
    }
}

function convertBody(body, to) {
    var from = bodyType(body)
    if (body === null || body === void 0 || !from || from === to) {
        return Promise.resolve(body)
    } else if (map[to] && map[to][from]) {
        return map[to][from](body)
    } else {
        return Promise.reject(new Error('Convertion from ' + from + ' to ' + to + ' not supported'))
    }
}


var map = {
    text: {
        json: function (body) {//json --> text
            return Promise.resolve(JSON.stringify(body))
        },
        blob: function (body) {//blob --> text
            return blob2text(body)
        },
        searchParams: function (body) {//searchParams --> text
            return Promise.resolve(body.toString())
        }
    },
    json: {
        text: function (body) {//text --> json
            return Promise.resolve(parseJSON(body))
        },
        blob: function (body) {//blob --> json
            return blob2text(body).then(parseJSON)
        }
    },
    formData: {
        text: function (body) {//text --> formData
            return text2formData(body)
        }
    },
    blob: {
        text: function (body) {//json --> blob
            return Promise.resolve(new Blob([body]))
        },
        json: function (body) {//json --> blob
            return Promise.resolve(new Blob([JSON.stringify(body)]))
        }
    },
    arrayBuffer: {
        blob: function (body) {
            return blob2ArrayBuffer(body)
        }
    }
}

function bodyType(body) {
    if (typeof body === 'string') {
        return 'text'
    } else if (support.blob && (body instanceof Blob)) {
        return 'blob'
    } else if (support.formData && (body instanceof FormData)) {
        return 'formData'
    } else if (support.searchParams && (body instanceof URLSearchParams)) {
        return 'searchParams'
    } else if (body && typeof body === 'object') {
        return 'json'
    } else {
        return null
    }
}


function reader2Promise(reader) {
    return new Promise(function (resolve, reject) {
        reader.onload = function () {
            resolve(reader.result)
        }
        reader.onerror = function () {
            reject(reader.error)
        }
    })
}
/*
 readAsBinaryString(File|Blob)
 readAsText(File|Blob [, encoding])
 readAsDataURL(File|Blob)
 readAsArrayBuffer(File|Blob)
 */
function text2formData(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function (bytes) {
        if (bytes) {
            var split = bytes.split('=')
            var name = split.shift().replace(/\+/g, ' ')
            var value = split.join('=').replace(/\+/g, ' ')
            form.append(decodeURIComponent(name), decodeURIComponent(value))
        }
    })
    return Promise.resolve(form)
}

function blob2ArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return reader2Promise(reader)
}

function blob2text(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return reader2Promise(reader)
}


function parseJSON(body) {
    try {
        return JSON.parse(body)
    } catch (ex) {
        throw 'Invalid JSON'
    }
}

module.exports = Body