'use strict'

// Dependencias 
const app = require('../src/app');
const http = require('http');
const debug = require('debug')('nodestr:server');

// Criação da Porta 
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Criando o server e rota
const server =  http.createServer(app);

//Servidor vai ouvir a rota
server.listen(port);
server.on('error', onError);

console.log('API rodando na porta ' + port);

// Função de busca de portas disponiveis
function normalizePort(val) {
    const port = parseInt(val,10);

    if (isNaN(port)) {
        return val;
    } 

    if (port >= 0) {
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;       
    }

    const bind = typeof port === 'string' ?
        'Pipe' + port :
        'Port' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already use');
            process.exit(1);
            break;
        default:
            throw error;
            
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe' + addr
        : 'port' + addr.port;
    debug('Listening on ' + bind);
}

