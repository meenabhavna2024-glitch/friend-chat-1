const socket = io("https://friend-chat-1-5k6l.onrender.com");

let username = document.getElementById("username");
let message = document.getElementById("message");
let messages = document.getElementById("messages");


function sendMessage(){

    if(username.value == ""){
        alert("Apna naam likho");
        return;
    }

    if(message.value == ""){
        return;
    }


    let data = {
        name: username.value,
        text: message.value
    };


    socket.emit("send_message", data);

    message.value = "";
}



socket.on("receive_message",(data)=>{

    let p = document.createElement("p");

    p.innerHTML = 
    "<b>"+data.name+"</b>: "+data.text;


    messages.appendChild(p);

    messages.scrollTop = messages.scrollHeight;

});