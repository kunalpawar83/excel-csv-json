const mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost:27017/excel-json');

const db = mongoose.connection;

db.on('connected',()=>{
    console.log('connected to Mongodb server');
});

db.on('error',(err)=>{
    console.log('mongodb connection error',err);
});

db.on('disconnected',()=>{
    console.log('mongodb server disconnected');
});


module.exports = db;