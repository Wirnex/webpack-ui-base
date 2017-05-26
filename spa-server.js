var serverFactory = require('spa-server');

var server = serverFactory.create({
    path: './dist',
    port: 8080,
    fallback: {}
});

server.start();
