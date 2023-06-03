const express=require('express')
const http=require('http')
const path=require('path')
const mongoose=require('mongoose')
const socketio=require('socket.io')
require('dotenv').config()
const formatMessage=require('./src/utils/messages')
const {userJoin,getCurrentUser}=require('./src/utils/users')
// const { setTheUsername } = require('whatwg-url')

const app= express()
const server=http.createServer(app)
//const {userJoin,getCurrentUser}=require('./src/utils/users')
const {PORT}=process.env
//setting static folder
const botName='chatApp-Bot'
app.use(express.static(path.join(__dirname,'public')))

// -------------------------------------------------------------

// ====================================================================================================
//run when the client is connected
        const io = socketio(server);
// io.on('connection', socket => {
//     socket.emit('request', /* … */); // emit an event to the socket
//     io.emit('broadcast', /* … */); // emit an event to all connected sockets
//     socket.on('reply', () => { /* … */ }); // listen to the event
//   });



//welcome the current and new user
io.on('connection',socket=>{
   socket.on('joinRoom',({username,room})=>{
    console.log("New WEB-SOCKET connection successful");
    // sending message to the console of the JS from server to the client
   //to single client
  const user=userJoin(socket.id,username,room);
  socket.join(user.room);

   socket.emit('message',formatMessage( botName ,"Welcome to chat App"));// emit an event to the socket
   // socket.emit("message","Welcome to chat App")//welcoming the current or new user
     //broadCast when a user connects
     // to all connected clients
                     //io.emit("hello");

// to all connected clients in the "news" room
                 // io.to("broadcast").emit("hello");
     // to all the clients
     socket.broadcast.to(user.room).emit('message',formatMessage( botName ,`${user.username} has joined the chat`));
     //socket.emit('broadcast',"A new user has joined the chat");
   //  console.log("a new user is connected to the app")
     //now in general
     //io.emit()-->this will run like infinite loop and will deliver the connections on and on 

   //all these above was for connection of a client
   })
   //Listen for chatMessage
   socket.on('chatMessage',msg=>{
    // console.log(msg);
    //emit back to the client
    io.emit('message',formatMessage( 'USER',msg));
   })
   //Runs when client disconnects
   socket.on('disconnect', ()=>{
    //console.log("a user has left the chat")
    io.emit('message',formatMessage( botName ,`${user.username} left the chat`))
   })
});   

// ======================================================================================
server.listen(PORT,()=>{
    console.log("Express is connected successfully at 3000")
})     