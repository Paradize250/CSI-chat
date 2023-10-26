//client: This is the Socket.IO client instance or socket that is currently handling a specific client's connection.

//create a constant client as seen on the server to use the function io used in app.js to connect the io to the client side
//// the line below is where we make a connection to the app.js by using the variable io
const client = io();

//create a constant to add an event listener on the send button
const sendMessage = document.querySelector("#sendMessage");

//create a variable for the messages to be displayed
const displayMsg =document.querySelector("#displayMsg");

let urlParams = new URLSearchParams(window.location.search);

//to be able to use the quill text editer in my html
const quill = new Quill('#editor', {
    theme: 'snow'
  });
//retrieving messages from the server
client.emit("getMessages",{});
client.on("sendGlobalMessages", (data)=>{ //from the emit in app.js about global messages
    
    console.dir(data);
    data.data.messages.forEach(element => {

/* <div class="list-group-item list-group-item-action flex-column align-items-start active">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">List group item heading</h5>
                            <small>3 days ago</small>
                        </div>
                        <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus
                            varius
                            blandit.</p>
                        <small>Donec id elit non mi porta.</small>
                    </div>
 */
        
    });
})
//detect the event of the send click
sendMessage.addEventListener("click",()=>{
    let text = quill.getText();
    let date = new Date();
    let id =urlParams.get('id');

//everytime there is an emit on one side, there is an on on the other side as well. (ping pong)
    client.emit("newMessage", {
       "id": id,
        "text": text,
        "date":date
    })

});

client.on("newGlobalMessage",(data)=>{ //from the emit in app.js
    
    console.dir(data);
})


/*emit("newGlobalMessage", { "data": data }):
 This is the actual message being sent. It uses the emit method to send an event named "newGlobalMessage" 
 to all other connected clients. The data to be sent is an object with a single property,
"data," which contains the value of the data variable.*/

///////this is the code for the textbox///////////////: