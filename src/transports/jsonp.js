
function JSONP(opts) {
    var callbackFunction = opts.jsonpCallbackFunction || generateCallbackFunction();
    var jsonpCallback = opts.jsonpCallback || 'callback'
    var xhr = document.createElement('script')
    if (xhr.charset) {
        xhr.charset = opts.charset
    }
    xhr.onerror = xhr[useOnload ? 'onload' : 'onreadystatechange'] = function (e) {
        var execute = /loaded|complete|undefined/i.test(xhr.readyState)
        if (e && e.type === 'error') {
            events['error'] && events['error']()
        } else if (execute) {
            setTimeout(function () {
                xhr.abort()
            }, 0)
        }
    }

    var events = {}
    xhr.on = function (type, fn) {
        events[type] = fn
    }
    xhr.abort = function () {
        events = {}
        removeNode(xhr)
        clearFunction(callbackFunction)
    }
    xhr.open = function (a, url) {
        window[callbackFunction] = function (response) {
            events['load'] && events['load']({
                status: 200,
                statusText: 'ok',
                response: response
            })
            clearFunction(callbackFunction)
        }
        var head = document.getElementsTagName('head')[0]

        url += (url.indexOf('?') === -1) ? '?' : '&';
        xhr.setAttribute('src', url + jsonpCallback + '=' + callbackFunction);
        head.insertBefore(xhr, head.firstChild)
        if (typeof opts.timeout === 'number') {
            setTimeout(function () {
                events['timeout'] && events['timeout']()
                xhr.abort()
            }, opts.timeout)
        }
    }
}


function generateCallbackFunction() {
    return ('jsonp' + Math.random()).replace(/0\./, '')
}

// Known issue: Will throw 'Uncaught ReferenceError: callback_*** is not defined' error if request timeout
function clearFunction(functionName) {
    // IE8 throws an exception when you try to delete a property on window
    // http://stackoverflow.com/a/1824228/751089
    try {
        delete window[functionName];
    } catch (e) {
        window[functionName] = undefined;
    }
}

var f = document.createDocumentFragment()
var useOnload = 'textContent' in document

function removeNode(node) {
    f.appendChild(node)
    f.removeChild(node)
    node.onload = onerror = onreadystatechange = function () {
    }
    return node
}

module.exports = JSONP