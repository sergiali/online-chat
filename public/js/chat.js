const socket = io();

//Query DOM
const messageInput = document.getElementById("messageInput"),
    chatForm = document.getElementById("chatForm"),
    chatBox = document.getElementById("chat-box"),
    feedback = document.getElementById("feedback"),
    onlineUsers = document.getElementById("online-users-list"),
    chatContainer=document.getElementById("chatcontainer");

    const nickname = localStorage.getItem("nickname");
    const datea = new Date();
    // const minute = datea.getUTCMinutes;
    // const houre = datea.getUTCHours;
    
// Emit Events

socket.emit("login",nickname);

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (messageInput.value) {
        socket.emit("chat message", {
            message: messageInput.value,
            name: nickname,
            date:datea.getUTCHours,
            date1:datea.getUTCMinutes,
        });
        messageInput.value = "";
    }
});

messageInput.addEventListener("keypress", () => {
    socket.emit("typing", { name: nickname });
});

// Listening

socket.on("online",(users) => {
    onlineUsers.innerHTML="";
    for(const socketId in users) {
        onlineUsers.innerHTML+=  
           `<li> 
                <button type="button" class="btn btn-light mx-2 p-2 " data-toggle = "modal" data-target="#pvChat" data-id=${socketId} data-client=${users[socketId]}>
                ${users[socketId]}
                   <span class="badge badge-success"> </span>
                </button>
            </li>
        `;
    }
});


socket.on("chat message", (data) => {
    feedback.innerHTML = "";
    chatBox.innerHTML += `
                        <li class="alert alert-light">
                            <span
                                class="text-dark font-weight-normal"
                                style="font-size: 13pt"> ${data.name} </span>
                            <span
                                class="
                                    text-muted
                                    font-italic font-weight-light
                                    m-2
                                "
                                style="font-size: 9pt">  ${data.date} : ${data.date1} </span>
                            <p
                                class="alert alert-info mt-2"
                                style="font-family: persian01" >
                            ${data.message}
                            </p>
                        </li>`;
                        chatContainer.scrollTop=chatContainer.scrollHeight-  chatContainer.clientHeight;
});

socket.on("typing", (data) => {
    feedback.innerHTML = `<p class="alert alert-warning w-25"><em>${data.name} در حال نوشتن است ... </em></p>`;
});

// jquery

$("#pvChat").on("show.bs.modal",(e) => {
    const button = $(e.relatedtarget);
    const user = button.data("client");
    const socketId = button.data("id");
})