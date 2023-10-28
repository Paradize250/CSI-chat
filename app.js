//to create my project I used the cmd npm init -y n my terminal server
//once the node_modules have been created in your project, create a gitignore file to exclude it as it is so heavy

/*create a constant to represent express with a require to be able to use the depedency. 
this module will be in charge of distributing index.html files to clients*/


const express = require('express'); // This module is used for creating a web server.
const http = require('http'); //The HTTP module is used to create an HTTP server.
const fs = require('fs'); //The File System module is used for reading files.
const app = express();
const hostname = '127.0.0.1';
const port = 8000;
const server = http.Server(app); //create an HTTP server using the Express application:
const io = require('socket.io')(server); /*This is a library that enables real-time,
 bidirectional event-based communication between clients and the server.. 
intialize Socket.IO and attach it to the HTTP server*/


let userLogins;

fs.readFile("./data/user.json", (err, txt) => {

  console.dir(err);
  userLogins = JSON.parse(txt);
  console.dir(userLogins);

});

console.dir(userLogins);
// Serve static files from the 'public' folder
app.use(express.static('public'));

// Define a route to serve the index.html file
/*This code specifies that when users access the root URL, 
the server will send the 'index.html' file, which is expected 
to be in the same directory as the server script*/

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
});


server.listen(port, hostname, function () {
  console.log("Server running at http://" + hostname + ":" + port + "/");
});
//to deploy  my server : // node --watch app.js to keep a watch on your code


//making the connection with socket IO
/*This block of code listens for WebSocket connections and logs information 
about the connected clients. It also listens for 'event' and 'disconnect' 
events from clients and can handle them as needed.*/
io.on('connection', client => {
  //console.dir(client.id);

  // When a client connects, log their unique ID to the server's console.

  client.on('event', data => {

    //console.dir(data);
    // When the client emits an 'event' (custom event) with data, log the data to the server's console.

    userLogins.user.forEach(element => {
      if (element.login === data.login && element.pwd === data.pwd) {
        client.emit("success", { "id": client.id });
      }
    });

    // Iterate through an array of user data (presumably from 'userLogins').
    // Check if any element in the array has matching 'login' and 'pwd' properties with the data sent by the client.
    // If a match is found, emit a 'success' event to the client with the client's unique ID.

  });

  /*This code below listens for the 'newMessage' event emitted by clients. The event data is passed as the data parameter.
  Inside the event handler:
  It declares a variable tmpMessages to temporarily store message data.
  It reads the content of a JSON file located at "./data/mesages.json" using the fs.readFile function. The file presumably contains a list of messages.
  It parses the content of the file (presumably an array of messages) and assigns it to the tmpMessages variable.
  It appends the new message data from the client (contained in the data parameter) to the tmpMessages array.
  It writes the updated tmpMessages array back to the same JSON file, effectively adding the new message.
  The console.dir statements log the client's unique ID and the received message data to the server's console. */


  //getting the messages from the server
  client.on("getMessages", () => {
    let tmpMessages;
    fs.readFile("./data/message.json", (err, dataMsg) => {
      console.log("error:" + err);
      tmpMessages = JSON.parse(dataMsg);
      client.emit("sendGlobalMessages", { data:tmpMessages });
    });
  });

  client.on("newMessage", (data) => { //from the emit in the chat js
    let tmpMessages;
    fs.readFile("./data/message.json", (err, dataMsg) => {

      tmpMessages = JSON.parse(dataMsg);
      tmpMessages.messages.push(data);

      fs.writeFile("./data/message.json", JSON.stringify(tmpMessages), (err) => {
        console.dir(err);
      });
      client.broadcast.emit("newGlobalMessage", { "data": data });
      /* emit the new message on the chat.js/the client's side.
      the .broadcast In the context of Socket.IO, this is a method that allows you to send a message
       to all connected clients except for the sender. It is used to broadcast a message to all other 
       clients connected to the same server.*/

    });

    console.dir(client.id);
    console.dir(data);
  })



  client.on('disconnect', () => { /* … */ });
});
