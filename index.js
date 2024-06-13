const express = require('express');
const app = express();
const db = require('./db');
const userRoute = require('./route/userRoute');


db;

app.use('/', userRoute);
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
