

module.exports = function AXO(opts) {
    var xhr = new ActiveXObject('Microsoft.XMLHTTP')
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (/^2\d\d|1224/.test(xhr.status)) {
                events['load'] && events['load'](xhr)
            } else {
                events['error'] && events['error']()
            }
        }
    }
    var events = {}
    xhr.on = function (type, fn) {
        events[type] = fn
    }

    xhr.abort = function () {
        events = {}
    }
    if (opts.timeout === 'number') {
        setTimeout(function () {
            events['timeout'] && events['timeout']()
            xhr.abort()
        }, opts.timeout)
    }
    return xhr
}