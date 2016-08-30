var Koa = require('koa')

var fs = require('fs')
var path = require('path')
//var convert = require('koa-convert');
var jsonp = require('koa-safe-jsonp');

var koaStaticPlus = require('koa-static-plus')
var Router = require('./router')
var body = require('koa-bodyparser');

var app = new Koa()
//处理静态资源
app.use(koaStaticPlus(path.join(__dirname, '../dist'), {
    pathPrefix: ''
}))
jsonp(app, {
    limit: 50 // max callback name string length, default is 512
});
app.use(body());


Router.get('/', function (a) {
    var text = fs.readFileSync(__dirname + '/views/index.html', 'utf-8')
    a.body = text
})
Router.get('/aaa', function (a) {
    a.body = "aaaaaa"
})
Router.get('/jsonp', function (a) {
    console.log('处理JSONP请求', a.request.query)
    a.jsonp = {foo: "bar", 'type': 'jsonp'};
})
Router.post('/upload', function (a) {
    console.log('upload请求')
    console.log(a.request.body)    // if buffer or text
    console.log(a.request.fields)  // if json
    console.log(a.request.files)   // if multipart or urlencoded

    a.body = {foo: "bar", 'type': 'upload'};
})


Router.get('/getAjax', function (a) {
    console.log('GET请求')
    var obj = a.request.query
    obj.nodejs = 'nodejs'
    a.body = obj
})

Router.get('/form.html', function (a) {
    console.log('GET FORM请求')
    var text = fs.readFileSync(__dirname + '/views/form.html', 'utf-8')
    var obj = a.request.query
    console.log(obj)
    a.body = text
})

Router.post('/postAjax', function (a) {
   
    var obj = a.request.body
     console.log('POST请求', obj)
    obj.form = '后端'
    a.body = obj
})


app.use(async function (ctx, next) {
    Router.match(ctx, next)
})


app.listen(4000, function () {
    console.log('server started 4000')
})

module.exports = app

