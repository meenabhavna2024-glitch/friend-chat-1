// ===============================
// FRIEND CHAT
// ===============================

// Logged-in user
const userName = localStorage.getItem("name");
const userMobile = localStorage.getItem("mobile");

// Selected chat user
const chatUserName = localStorage.getItem("chatUserName");
const chatUserMobile = localStorage.getItem("chatUserMobile");


// Login check
if (!userName || !userMobile) {
    window.location.href = "login.html";
}


// अगर Home से कोई user select नहीं किया
if (!chatUserName || !chatUserMobile) {
    window.location.href = "home.html";
}


// HTML elements
const profileName = document.getElementById("profileName");
const status = document.getElementById("status");
const message = document.getElementById("message");
const messages = document.getElementById("messages");
const username = document.getElementById("username");


// Current username
username.value = userName;


// Selected friend's name
profileName.innerText = chatUserName;


// Status
status.innerText = "🟢 Online";


// Socket.IO connection
const socket = io("https://friend-chat-1-5k6l.onrender.com");


// ===============================
// SEND MESSAGE
// ===============================

function sendMessage() {

    const text = message.value.trim();

    if (text === "") {
        return;
    }


    const data = {

        sender: userMobile,

        receiver: chatUserMobile,

        text: text

    };


    socket.emit("send_message", data);


    message.value = "";

}


// ===============================
// RECEIVE MESSAGE
// ===============================

socket.on("receive_message", (data) => {


    // केवल इसी chat के messages दिखाओ
    const isThisChat =

        (
            data.sender === userMobile &&
            data.receiver === chatUserMobile
        )

        ||

        (
            data.sender === chatUserMobile &&
            data.receiver === userMobile
        );


    if (!isThisChat) {
        return;
    }


    const div = document.createElement("div");


    if (data.sender === userMobile) {

        div.className = "myMessage";

    } else {

        div.className = "otherMessage";

    }


    div.innerHTML = `

        <div class="chatName">
            ${
                data.sender === userMobile
                ? "You"
                : chatUserName
            }
        </div>

        <div>
            ${escapeHTML(data.text)}
        </div>

    `;


    messages.appendChild(div);


    messages.scrollTop =
        messages.scrollHeight;

});


// ===============================
// SAFE TEXT
// ===============================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}