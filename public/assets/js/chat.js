//client: This is the Socket.IO client instance or socket that is currently handling a specific client's connection.

//create a constant client as seen on the server to use the function io used in app.js to connect the io to the client side
//// the line below is where we make a connection to the app.js by using the variable io
const client = io();

//create a constant to add an event listener on the send button
const sendMessage = document.querySelector("#sendMessage");

//create a variable for the messages to be displayed
const displayMsg = document.querySelector("#displayMsg");

//creating a function th add the message in the msgbox immediately without reload
const createMessage =(id,date,text)=>{
    displayMsg.innerHTML +=

        `<div class="list-group-item list-group-item-action flex-column align-items-start active">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${id}</h5>
            <small>${date}</small>
        </div>
        <p class="mb-1">${text}</p>
        <small>active</small>
    </div>`;
}

const userList = document.querySelector("#userList");

let urlParams = new URLSearchParams(window.location.search);

//to be able to use the quill text editer in my html
const quill = new Quill('#editor', {
    theme: 'snow'
});
//retrieving messages from the server
client.emit("getMessages", {});
client.on("sendGlobalMessages", (data) => { //from the emit in app.js about global messages

    console.dir(data);

    let displayTmp = "";
    data.data.messages.forEach(element => {
        console.dir(element);
        displayTmp +=

            `<div class="list-group-item list-group-item-action flex-column align-items-start active">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${element.id}</h5>
                    <small>${element.date}</small>
                </div>
                <p class="mb-1">${element.text}</p>
                <small>active</small>
            </div>`;


    });
    console.dir(displayTmp);
    displayMsg.innerHTML = displayTmp;

    //trying to display the user
    let userTmp = "";
    data.data.messages.forEach(element => {
        userTmp += `<li class="list-group-item d-flex justify-content-between align-items-center">
        ${element.id}
        <span class="badge bg-primary rounded-pill"></span>`
    });
    userList.innerHTML = userTmp;
    //this has not worked yet



})
//detect the event of the send click
sendMessage.addEventListener("click", () => {
    let text = quill.getText();
    let date = new Date();
    let id = urlParams.get('id');

    //everytime there is an emit on one side, there is an on on the other side as well. (ping pong)
    client.emit("newMessage", {
        "id": id,
        "text": text,
        "date": date
    })

createMessage(id,date,text);
});


//the on for the new message 
client.on("newGlobalMessage", (data) => { //from the emit in app.js
    createMessage(data.data.id,data.data.date,data.data.text);
})


/*emit("newGlobalMessage", { "data": data }):
 This is the actual message being sent. It uses the emit method to send an event named "newGlobalMessage"
 to all other connected clients. The data to be sent is an object with a single property,
"data," which contains the value of the data variable.*/

///////this is the code for the textbox///////////////: