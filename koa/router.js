var Router = {map: {}}

'get,del,put,post'.replace(/\w+/g, function (a) {
    var method = a.toUpperCase()
    Router.map[method] = []
    Router[a] = function (url, cb) {
        var keys = []
        
        var re = pathToRegexp(url, keys)
        this.map[method].push({
            re: re,
            url: url,
            cb: cb
        })
    }
})
var pathToRegexp = require('path-to-regexp')

Router.onerror = function (ctx) {
    ctx.body = '404!!'
}
Router.match = function (ctx, next) {
    var array = this.map[ctx.method] || []
    for (var i = 0, el; el = array[i++]; ) {
        var aaa = el.re.exec(ctx.path)
        if (aaa) {
            var args = aaa.slice(1)
            el.cb(ctx, next, args)
            return
        }
    }
    Router.onerror(ctx, next)
}

module.exports = Router
