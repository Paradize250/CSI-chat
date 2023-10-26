//create a constant client as seen on the server to use the function io used in app.js to connect the io to the client side
//// the line below is where we make a connection to the app.js by using the variable io

const client = io();



//creating a constant for the form created and colling it from the already known forms in JS
const formlogin = document.forms.formlogin;




//make sure that the page does not reload after clicking submit (avoiding post as seen in PHP) this way wa avoid loosing the data
formlogin.addEventListener("submit",(e)=> {
    e.preventDefault();



//create a variable that helps save login information  and connects it with the json created
console.dir(formlogin);
let login = formlogin[0].value;
let pwd = formlogin[1].value;

client.emit("event", {"login":login,"pwd":pwd});
})
client.on("success",(data)=>{
    window.location = "./chat.html?id="+data.id;
})


////// this is the code to handle the login page///////////////