import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";


function Sidebar() {
  const {allThreads, setallThreads,currThreadId,setnewChats, setPrompt , setReply ,setCurrThreadId,setPrevchats} =useContext(MyContext);
  const getAllThreads= async () =>{
   try{
    const response=await fetch("http://localhost:8080/api/thread");
    const res=await response.json();
    const filteredData= res.map(thread => ({threadId : thread.threadId, title:thread.title}));
    console.log(filteredData);
    setallThreads(filteredData);
   }
    catch(err){
      console.log(err);
    }
   
  };

  useEffect(()=>{
  getAllThreads();
  },[currThreadId])

  const createNewChat =() =>{
    setnewChats(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevchats([]);
  }

  const changeThread = async (newthreadId)  =>{
  setCurrThreadId(newthreadId);
  try{
   const response=await fetch(`http://localhost:8080/api/thread/${newthreadId}`);
   const res=await response.json();
   console.log(res);
   setPrevchats(res);
   setnewChats(false);
   setReply(null);
  }catch(err){
    console.log(err);
  }
  }

  const deleteThread = async (threadId)=>{

    try{
   const response=await fetch(`http://localhost:8080/api/thread/${threadId}`, {method : "DELETE"});
   const res=await response.json();
   console.log(res);

   //updates chat ko re-rendered
   setallThreads(prev => prev.filter(thread => thread.threadId != threadId));
   if(threadId === currThreadId){
    createNewChat();
   }

    }catch(err){
      console.log(err);
    }
  }

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src="src/assets/blacklogo.png" alt="gpt logo"  className="logo"></img>
        <span><i className="fa-solid fa-pen-to-square"></i></span>
      </button>


      <ul className="history">
        {
          allThreads?.map((thread,idx)=>(
            <li key={idx} onClick={(e)=> changeThread(thread.threadId)} className={thread.threadId === currThreadId ? "highlighted" : " "}>
              {thread.title} <i className="fa-solid fa-trash"
              onClick={(e)=>{e.stopPropagation();
                       deleteThread(thread.threadId);
              }
              }></i>
              </li>
          ))
        }
      </ul>
      <div className="sign">
        <p>Apna college &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;