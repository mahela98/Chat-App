const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and password from url
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

// console.log(username,room);

const socket = io();

//send username and room to server
socket.emit('joinRoom', {username,room}); 

//get room and users
socket.on('roomUsers',({room,users}) =>{
    outputRoomName(room);
    outputUsers(users);
});

//message from server
socket.on('message' , message => {
 console.log(message);
 outputMessage(message);

 //scrol down to the new message
 chatMessages.scrollTop= chatMessages.scrollHeight;
});

//message submit
// e means event paramiter
chatForm.addEventListener('submit',(e) => {
    e.preventDefault();
    //msg is the input id in chat.html
    const msg = e.target.elements.msg.value;
    // console.log(msg);

    //emit message to the server
    socket.emit('chatMessage' , msg);

    //clear input after sending the message
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});


//output message to dome
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to DOM
function outputRoomName(room){
 roomName.innerText = room;
}

//add users to dom

function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
   }
  
