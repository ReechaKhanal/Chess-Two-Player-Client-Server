const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

// Spinning the http server and the websocket server
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
    httpServer: server
});

// Generates uniqueID for every new connectipm
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4()
};

// I am maintaining all active connections in this object.
const clients = {};
// I am maintaining all active users in this object
const users = {};
// The current State of the board is maininted here
let boardState = null;
// User activity history
let userActivity = [];

//let currentUsers = null, userActivity = null , username = null, stateBoard = null, selectedPiece = null, turn = null, 
//    takenWhitePieces = null, takenBlackPieces = null, win = null, check = null, whiteHasMoved = null, blackHasMoved = null;

const sendMessage = (json) => {
    // We are sending the current data to all connected clients
    Object.keys(clients).map((client) => {
        clients[client].sendUTF(json);
    });
}

const typesDef = {
    USER_EVENT: "userevent",
    CONTENT_CHANGE: "contentchange"
}

wsServer.on('request', function(request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Received a new connection from origin ' + request.origin + '.')

    /* This part of code can also be re-written to accept only the requests from allowed origins */
    // we accept a connection request
    const connection = request.accept(null, request.origin);
    clients[userID] = connection; // Assigning a userid to a connection

    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

    connection.on('message', function(message){
        
        if (message.type === 'utf8'){
            const dataFromClient = JSON.parse(message.utf8Data);
            const json = { type: dataFromClient.type }
            
            console.log("****************")
            console.log(dataFromClient.type)
            console.log("****************")

            // if the request from the client is a user event - received from the login information
            if (dataFromClient.type === typesDef.USER_EVENT){
                
                users[userID] = dataFromClient;
                userActivity.push(`${dataFromClient.username} joined`);
                json.data = {users, userActivity}
            } 
            else if (dataFromClient.type === typesDef.CONTENT_CHANGE) {
                
                boardState = dataFromClient;
                boardState.userActivity = userActivity;
                json.data = {boardState};
            }
            console.log(json)
            sendMessage(JSON.stringify(json));
        }
    });
    // user disconnected
    connection.on('close', function(connection){
        
        console.log((new Date()) + " Peer " + userID + " disconnected.");
        //console.log(users[userID])
        //console.log(users[userID].username)
        const json = { type: typesDef.USER_EVENT };
        //console.log('1')
        userActivity.push(`${users[userID].username} left`);
        //console.log('2')
        json.data = { users, userActivity };
        //console.log('3')
        delete clients[userID];
        delete users[userID];
        sendMessage(JSON.stringify.json);
    });
});