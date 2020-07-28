var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = 80;
const {
    userJoin,
    userLeave,
    getCurrentUser,
    getRoomUsers
} = require('./utils/user')
const fs = require('fs');

app.use(express.static(__dirname + '/public'));
app.get('/chat', (req, res) => {
    let file = fs.readFileSync(__dirname + '/public/chat.html');

    res.end(file);

});


io.on('connection', socket => {
    socket.on("Join Room", ({ username, roomname }) => {
        const user = userJoin(socket.id, username, roomname);

        socket.join(roomname);
        //Welcoming the user that joined

        socket.emit("message", `Welcome to the room: ${roomname}`);


        //Notifying others in the room
        socket.broadcast.to(roomname).emit("message", `${username} has joined the room`);


        //Details about the drawing

        //Details about the message sent by user
        socket.on("Chat Message", (message) => {
            // If the message sent is same as the word
            var { id, username, roomname } = getCurrentUser(socket.id);
            console.log(username + " has sent a message");
            io.to(roomname).emit('Chat Message', { username, message });




        });
        // Send users and room info
        io.to(roomname).emit('Room Users', {
            room: roomname,
            users: getRoomUsers(roomname),
            you: socket.id
        });

    });






    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.roomname).emit(
                'message',
                `${user.username} has left the room`
            );

            // Send users and room info
            io.to(user.roomname).emit('Room Users', {
                room: user.roomname,
                users: getRoomUsers(user.roomname),
                you: socket.id
            });
        }
    });



});


http.listen(PORT, () => {
    console.log("Listening at PORT: " + PORT);

});
