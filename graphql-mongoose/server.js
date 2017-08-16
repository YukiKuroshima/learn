var path = require('path');
var express = require('express');
var app = express();
// start the server
app.listen(3000,()=> {console.log("+++Express Server is Running!!!")})
app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/index.html')
})
