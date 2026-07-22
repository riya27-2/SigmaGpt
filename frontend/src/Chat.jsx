 import "./Chat.css";
 import { useContext } from "react";
 import { MyContext } from "./MyContext";

function Chat(){
    const {newchat, prevchats}=useContext(MyContext);
    return(
    <>
    {newchat && <h1>start a new chat!</h1>}
    <div className="chats">
        {
            prevchats?.map((chat,idx)=>
       <div className={chat.role === "user" ? "userDiv" : "gptDiv" } key={idx}>
        {
            chat.role === "user" ? <p className="userMessage">{chat.content}</p> : <p className="gptMessage">{chat.content}</p>
        } 
        </div>
            )
        }



   
    </div>
    </>
    )
}

export default Chat;