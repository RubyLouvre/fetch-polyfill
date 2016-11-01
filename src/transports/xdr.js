//https://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx
module.exports = function XDR(opts) {
    var xhr = new XDomainRequest()
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
    if (typeof opts.timeout === 'number') {
        xhr.timeout = opts.timeout
    }
    return xhr
}