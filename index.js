var http = require('http'),
    httpProxy = require('http-proxy');
var proxy = new httpProxy.createProxyServer({
});

var option = {
    target: {
        host: '192.168.1.231',
        port: 8874
    },
    selfHandleResponse: true
};
proxy.on('proxyRes', function (proxyRes, req, res) {
    var body = [];
    proxyRes.on('data', function (chunk) {
        body.push(chunk);
    });
    proxyRes.on('end', function () {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        body = Buffer.concat(body).toString('utf-8');
        console.log('request url:', req.url);
        // console.log('response body:', proxyRes);
        console.log("res from proxied server:", body);
        if (req.url.endsWith('/api/user/login') || req.url.indexOf('/api/user/login?') != -1) {
            body = body.replace(/}(?=\{).+/s, '}');
        }
        res.end(body);
    });
});

var server = http.createServer(function (req, res) {
    proxy.web(req, res, option);
});

console.log("listening on port 3000")
server.listen(3000);