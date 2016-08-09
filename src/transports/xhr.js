
module.exports = function XHR(opts) {
    var xhr = new XMLHttpRequest
    'load,error,timeout'.replace(/\w+/g, function (method) {
        xhr['on' + method] = function () {
            if (events[method]) {
                events[method](xhr)
            }
        }
    })
    var events = {}
    xhr.on = function (type, fn) {
        events[type] = fn
    }
    xhr.onabort = function () {
        events = {}
    }
    if (opts.credentials === 'include') {
        xhr.withCredentials = true
    }

    if ('responseType' in xhr && ('Blob' in window)) {
        xhr.responseType = 'blob'
    }
    return xhr
}