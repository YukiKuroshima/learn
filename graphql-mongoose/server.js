var path = require('path');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var ToDo = require('./mongoose/todo');
import bodyParser from 'body-parser';


app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost:27017/local')
var db = mongoose.connection;
db.on('error', ()=> {console.log( '---FAILED to connect to mongoose')})
db.once('open', () => {
  console.log( '+++Connected to mongoose')
})

// start the server
app.listen(3000,()=> {console.log("+++Express Server is Running!!!")})
app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/index.html')
})

app.post('/quotes',(req,res)=>{
  // Insert into TodoList Collection
  console.log(typeof(ToDo))
  var todoItem = new ToDo({
    itemId:1,
    item:req.body.item,
    completed: false
  })
  todoItem.save((err,result)=> {
    if (err) {console.log("---TodoItem save failed " + err)}
    console.log("+++TodoItem saved successfully "+todoItem.item)
    res.redirect('/')
  })
})

