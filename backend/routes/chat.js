import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/geminiAi.js";


const router =express.Router();

//test

router.post("/test",async(req ,res) =>{
try{
  const thread=new Thread({
    threadId : "abc",
    title: "Testing new thread"
  });
  const response =await thread.save();
  res.send(response);
}catch(err){
    console.log(err);
    res.status(500).json({error: "Failed to save in DB"});
}
});

//GET ALL THREADS
router.get("/thread",async(req , res)=>{
    try{
  const threads= await Thread.find({}).sort({updatedAt:-1});
  res.json(threads);
    }catch (err) {
    console.error("THREAD ERROR:", err);
    return res.status(500).json({
        error: err.message,
        stack: err.stack
    });
}
});

//fetch chat id
router.get("/thread/:threadId",async(req , res)=>{
    const {threadId}=req.params;
    try{
  const thread= await Thread.findOne({threadId});
   if(!thread){

    res.status(404).json({error: "Thread not foound"});


   }

res.json(thread.messages);
    }catch(err){
        console.log(err);
    res.status(500).json({error: "Failed to fetch"});
    }
});

//delete route
router.delete("/thread/:threadId",async(req , res)=>{
    const {threadId}=req.params;
    try{
  const deleteThread= await Thread.findOneAndDelete({threadId});
   if(!deleteThread){

    res.status(404).json({error: "Thread could not deleted"});


   }

    res.status(200).json({success: "Thread  deleted successfully"});
    }catch(err){
        console.log(err);
    res.status(500).json({error: "Failed to delete fetch"});
    }
});

//main chat route

router.post("/chat",async(req , res)=>{
    const {threadId,message}=req.body;
     if(!threadId || !message){

    res.status(404).json({error: "missing require fields"});
   }

    try{
  let thread= await Thread.findOne({threadId});
  if(!thread){
  thread=new Thread({
    threadId,
    title:message,
    messages: [{role:"user", content:message}]
  })
  }else{
    thread.messages.push({role:"user", content:message});
  }

  const assistantReply=await getGeminiAPIResponse(message);
      thread.messages.push({role:"assistant", content: assistantReply});
      thread.updatedAt=new Date();
      await thread.save();
     return res.json({reply : assistantReply});

    }catch(err){
        console.log(err);
            res.status(500).json({error: "something went wrong"});

    }
});

export default router;