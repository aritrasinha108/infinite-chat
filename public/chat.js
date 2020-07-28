

var socket = io();

var url = window.location.url;
const { username, roomname } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
console.log(username + " " + roomname);
var messageBox = document.getElementById("msgbox");
var chat = document.getElementById("chat");


var send = document.getElementById("send");
send.addEventListener("click", () => {
    socket.emit("Chat Message", messageBox.value);
    messageBox.value = "";
});


socket.emit('Join Room', { username, roomname });
socket.on("message", (data) => {
    displayBotMessage(data);
})
socket.on("Room Users", (data) => {
    var members = document.getElementById('members');
    members.innerHTML = AddMembers(data.users);
    var room = document.getElementById('room-name');
    room.innerHTML = data.room;

})

socket.on("Chat Message", ({ username, message }) => {
    displayMessage(username, message);

});

function displayMessage(username, message) {
    var messagebox = document.createElement("div");
    messagebox.setAttribute("class", "message-box");
    messagebox.innerHTML = ` <span class="name">
                    ${username}
                </span>

                ${message}
`;
    chat.appendChild(messagebox);
}
function displayBotMessage(message) {
    var messagebox = document.createElement("div");
    messagebox.setAttribute("class", "bot-message-box");
    messagebox.innerHTML = `${message}`;
    chat.appendChild(messagebox);
}

function AddMembers(users) {
    var inside = "";
    users.forEach(user => {
        if (user.username == username) {
            inside += ` <div class="member-name">
                ${user.username}
                <br>
                <span id="you">You</span>
            </div>`;
        }
        else {
            inside += `<div class="member-name">
                ${user.username}
            </div>`
        }
    });
    return inside;
}
