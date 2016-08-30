//http://my.oschina.net/u/1416844/blog/660951
require("babel-core/register")(
    {
        presets: ['stage-3','es2015']
    }
);
//http://stackoverflow.com/questions/31122193/babel-polyfill-what-is-that
require("babel-polyfill");
require("./app.js");
