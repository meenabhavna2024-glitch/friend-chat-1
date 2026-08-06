// =============================
// Friend Chat Script
// =============================

// Login Check
let userName = localStorage.getItem("name");
let userMobile = localStorage.getItem("mobile");

if (!userName || !userMobile) {
    window.location.href = "login.html";
}

// Socket Connection
const socket = io("https://friend-chat-1-5k6l.onrender.com");

// Elements
let username = document.getElementById("username");
let profileName = document.getElementById("profileName");
let status = document.getElementById("status");
let message = document.getElementById("message");
let messages = document.getElementById("messages");

// Set User Info
username.value = userName;
profileName.innerText = userName;
status.innerHTML = "🟢 Online";

// Send Message
function sendMessage() {

    if (message.value.trim() === "") {
        return;
    }

    let data = {
        name: userName,
        mobile: userMobile,
        text: message.value.trim()
    };

    socket.emit("send_message", data);

    message.value = "";
}

// Receive Message
socket.on("receive_message", (data) => {

  let div = document.createElement("div");

if(data.mobile == userMobile){
    div.className = "myMessage";
}else{
    div.className = "otherMessage";
}

div.innerHTML = `
<div class="chatName">${data.name}</div>
<div>${data.text}</div>
`;

messages.appendChild(div);

messages.scrollTop = messages.scrollHeight;

    messages.scrollTop = messages.scrollHeight;
});