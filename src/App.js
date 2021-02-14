import React, {useState,useEffect} from 'react';
import { Button,FormControl,InputLabel,Input } from '@material-ui/core';
import './App.css';
import Message from './Components/Message';
import FlipMove from "react-flip-move";
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';
import axios from './axios';
import Pusher from 'pusher-js'


function App() {
  const [input,setInput]=useState("");
  const [messages,setMessages]=useState([]);
  const [username,setUsername]=useState("");

  const pusher = new Pusher('efc57b210ee48de83337', {
    cluster: 'ap2'
  });


  useEffect(() => {
    const channel = pusher.subscribe('messages');
    channel.bind('newMessages', function(data) {
      sync();
    });
  },[username])

  const sync=async ()=>{
    await axios.get("/retrieve/conversation")
    .then((res)=>{
      console.log(res.data);
      setMessages(res.data);
    })
  }

  useEffect(() => {
    sync();
  },[])


  useEffect(() => {
    setUsername(prompt("Enter your name"));
  }, []);

  const sendMessage=(event)=>{
    event.preventDefault();
    axios.post("/save/messages/",{
      username:username,
      message:input,
      timestamp:Date.now()
    })
    setInput("");
  }
  return (
    <div className="App">
      <img src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100" />
      <h1>Messenger Clone</h1>
  <h2>Welcome {username}</h2>
      <form className="app__form">
      <FormControl className="app__formControl">
        <InputLabel>Write message</InputLabel>
        <Input className="app__input" value={input} onChange={event => setInput(event.target.value)} />
        <IconButton className="app__iconButton" disabled={!input} variant="contained" color="primary" type="submit" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </FormControl>
      </form>
      <FlipMove>
      {
        messages.map((message)=>(
          <Message 
            key={message._id} 
            onClick={sendMessage}
            username={username} 
            message={message} />     
        ))
      }
      </FlipMove>
    </div>
  );
}

export default App;
