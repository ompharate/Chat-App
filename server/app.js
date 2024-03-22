import express from 'express';
import auth from './routes/auth.js';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const server= new createServer(app);

const corsOptions = {
    origin:"http://localhost:5173",
    credentials:true,
    methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
};
const io = new Server(server,{cors:corsOptions});


const port = process.env.PORT || 3000;



app.use(cors(corsOptions));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Socket middleware
io.use((socket,next)=>{
    socket.userName=socket.handshake.auth.userName;
    next();
});

// Socekt.io logic goes here
io.on('connection',(socket)=>{
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      userName: socket.userName,
    });
  }
  socket.emit("users", users);

    socket.broadcast.emit("user connected",{
        userID: socket.id,
        userName: socket.userName,
      });

    socket.on('disconnect',(socket)=>{
        console.log('User disconnected');
    });
    socket.on('message',(req)=>{
        console.log(req);
    });
});
// Http server
server.listen(port,(req,res)=>{
    console.log('Server is running on port 3000');
})

app.get('/',(req,res)=>{
    res.send('Working fine');
});

app.use('/auth',auth);