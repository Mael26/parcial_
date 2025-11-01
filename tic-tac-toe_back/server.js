const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 8080;

// 1. Configuración de archivos estáticos (como /src/main/resources/static)
app.use(express.static('public'));

// 2. Controlador HTTP (equivalente a /status)
app.get('/status', (req, res) => {
    res.json({
        status: `Servidor corriendo en puerto ${PORT}`,
    });
});

// Inicializa el servidor HTTP
const server = http.createServer(app);

// Inicializa el servidor WebSocket montado en el HTTP (equivalente a @ServerEndpoint)
const wss = new WebSocket.Server({ server, path: '/ttt-services' }); // Endpoint: ws://localhost:8080/ttt-services

// Manejo de conexiones WebSocket
wss.on('connection', function connection(ws) {
    // console.log('Cliente WebSocket conectado.');
    // ws.send('Connection established.'); // Mensaje de bienvenida al nuevo cliente

    // Manejo de mensajes entrantes
    ws.on('message', function incoming(message) {
        // guardaContexto(message);
        console.log('Recibido de cliente: %s', message);
    });
    

    // Manejo de desconexiones
    ws.on('close', () => {
        console.log('Conexión WebSocket cerrada.');
    });

    // Manejo de errores
    ws.on('error', (err) => {
        console.error('Error en conexión WebSocket:', err.message);
    });
});

// function guardaContexto(contexto){
//     console.log("❤️❤️❤️",contexto,"❤️❤️❤️");
// }

// Función de Broadcast (equivalente a TimedMessageBroker con @Scheduled)
const broadcast = () => {    
    // Itera sobre todos los clientes conectados y les envía el mensaje
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            console.log(gameContext);
            console.log(JSON.stringify(gameContext))
            client.send(JSON.stringify(gameContext));
            // console.log(`Sent: ${msg}`);
        }
    });
};

// Contexto con la información del juego
const gameContext = {
    squares: Array(9).fill(null),
    history: [Array(9).fill(null)],
}

// Configura el envío periódico de mensajes (cada 5000 ms = 5 segundos)
setInterval(broadcast, 1000);

// Inicia el servidor
server.listen(PORT, () => {
    console.log(`Servidor Node.js/Express escuchando en http://localhost:${PORT}`);
    console.log(`WebSocket Endpoint en ws://localhost:${PORT}/ttt-services`);
});