const socket = io("/");
let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");
// const user = prompt("Enter your name");
var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "443",
});
peer.on("open", (id) => {
    socket.emit("join-room", CHAT_ID, id, user);
});
send.addEventListener("click", (e) => {
    console.log("text");
    if (text.value.length !== 0) {
        socket.emit("message", text.value);
        text.value = "";
    }
});

text.addEventListener("keydown", (e) => {
    console.log("text2");
    if (e.key === "Enter" && text.value.length !== 0) {
        socket.emit("message", text.value);
        text.value = "";
    }
});
socket.on("createMessage", (message, userName) => {
    console.log("text3");
    console.log(userName);
    console.log(user);
    if (userName === user) {
        messages.innerHTML =
            messages.innerHTML +
            `<div class="message">
                <div class="media media-chat media-chat-reverse">
                    <div class="media-body">
                        <p>${message}</p>
                    </div>
                </div>
            </div>`;
    }
    else {
        messages.innerHTML =
            messages.innerHTML +
            `<div class="message">
                <div class="media media-chat"> <img class="avatar"
                src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="...">
                    <div class="media-body">
                        <p>${message}</p>
                    </div>
                </div>
            </div>`;
    }
});