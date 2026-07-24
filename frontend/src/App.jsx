import "./App.css";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import {MyContext} from "./MyContext";
import { useState } from "react";
import {v1 as uuidv1} from "uuid";

function App() {

  const [prompt,setPrompt]=useState("");
  const [reply, setReply]=useState(null);
  const [currThreadId, setCurrThreadId]=useState(uuidv1());
  const [prevchats, setPrevchats]=useState([]);
  const [newchat,setnewChats]=useState(true);
  const [allThreads, setallThreads]=useState([]);

const providerValues={
  prompt,setPrompt,
  reply,setReply, 
  currThreadId, setCurrThreadId,
  newchat,setnewChats,
  prevchats,setPrevchats,
  allThreads,setallThreads
};

  return (
    <MyContext.Provider value={providerValues}>
      <div className="app">
        <Sidebar />
        <ChatWindow />
      </div>
    </MyContext.Provider>
  )
}
export default App;
