//Dependences to use and libraries
const http=require('http');
const express=require('express');
const app=express();
const sqlite3=require('sqlite3').verbose();
const path=require('path');

//Resources
app.use(express.static(__dirname+'/'))

//Configuration of servidor
app.set("view engine","ejs");
app.set("views", path.join(__dirname,""));
app.use(express.urlencoded({extended:false}));
app.listen(5000);
console.log("Server is running");