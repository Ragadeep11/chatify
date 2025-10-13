// const express=require('express')
import express from 'express';
import dotenv from 'dotenv'
import path from "path"
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
const app=express()
const __dirname=path.resolve()
dotenv.config()
const PORT=process.env.PORT
app.use(express.json())//req.body
app.use(cookieParser())


app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
// make ready for deployment
if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}

app.listen(PORT,()=>{
    console.log("server is listening at "+PORT);
    connectDB();
    
})
