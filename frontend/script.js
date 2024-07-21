const chat=document.querySelector(".chat");
const chatWindow=document.querySelector(".chat-window");
let chatHistory=[];
let currentUsername='';

const socket=io();

socket.on("receive-message",(data)=>{
    const {chatHistory: newChatHistory,username}=data || {};
    // if(username!==undefined){
        // updateUsername(username);
        // render(chatHistory);
    // }
    if (username !== undefined && username !== currentUsername) {
        updateUsername(username);
        currentUsername = username;
      }
      if (newChatHistory) {
        render(newChatHistory);
      }

})

chat.addEventListener("submit",function(e){
    e.preventDefault();
    const message = chat.elements.message.value;
  console.log("Sending message:", message);
  sendMessage(message);
    // sendMessage(chat.elements.message.value);
    chat.elements.message.value="";
});


// This function is using the socket object and emitting a new event called ”post-message” which sends the
//  value of the text currently typed into the input box to our WebSocket backend server. This message is transformed into an object with the message property.
async function sendMessage(message){
    socket.emit("post-message",{
        message,
    });
}


function render(chatHistory){
    const html=chatHistory.map(function({username,message}){
        return messageTemplate(username,message);
    })
    .join("\n");
    chatWindow.innerHTML=html;
}

// function render(chatHistory) {
//     const html = chatHistory
//       .map(({ username, message }) => `<div>${username}: ${message}</div>`)
//       .join("\n");
//     chatWindow.innerHTML = html;
//   }

function updateUsername(username) {
    document.querySelector("h1").innerHTML = username;
  }
  

function messageTemplate(username,message){
    return `<div class='flex items-center'>
        <div class='w-5 h-5 bg-green-400 text-white rounded-full flex items-center justify-center mr-2'>
            <i class="fas fa-user"></i>
        </div>
        <p class="text-gray-100 text-lg">${username}: ${message}</p>
    </div>`;
}



