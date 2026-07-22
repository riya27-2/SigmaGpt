import "./ChatWindow.css";
import Chat from "./Chat"
import { MyContext } from "./MyContext";
import { useContext ,useState, useEffect} from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {

const {prompt,setPrompt,reply,setReply, currThreadId, prevchats, setPrevchats}= useContext(MyContext);
const[loading, setLoading]=useState(false);

const getReply =async()=>{
  setLoading(true);
  console.log("message",prompt,"threadId", currThreadId);
  const Options={
    method:"POST",
    headers:{
      "Content-Type": "application/json"
    },
    body:JSON.stringify({
      message: prompt,
      threadId: currThreadId
    })
  };
  try{
  const response=await fetch("http://localhost:8080/api/chat",Options);
  const res= await response.json();
  console.log(res);
  setReply(res.reply);
  }catch(err){
    console.log(err);
  }
  setLoading(false);
}
//Append new chat to previous chat
useEffect(()=>{
  if(prompt && reply){
    setPrevchats(prevchats=>(
      [...prevchats,{
        role:"user",
        content: prompt
      },{
        role:"assistant",
        content: reply
      }]
    ))
  }
setPrompt("");
},[reply])


  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>SigmaGPT&nbsp;<i className="fa-solid fa-angle-down"></i></span>
        <div className="userIconDiv">
         <span><i className="fa-solid fa-user"></i></span> 

        </div>

      </div>
      <Chat></Chat>
     <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

      <div className="ChatInput">
        <div className="inputBox">
          <input placeholder="Ask Anything" value={prompt} onChange={(e)=>setPrompt(e.target.value)} onKeyDown={(e)=> e.key==="Enter" ? getReply(): ''}>
          </input>
          <div id="Submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          SigmaGpt can make mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;