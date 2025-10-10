// const express=require('express')
import express from 'express';
import dotenv from 'dotenv'
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
const app=express()

dotenv.config()
const PORT=process.env.PORT

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

app.listen(PORT,()=>{
    console.log("server is listening at "+PORT)
})
