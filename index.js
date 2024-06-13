const express = require('express');
const app = express();
const {connectDB} =  require('./db.js');
const userRoute = require('./route/userRoute');

app.use('/', userRoute);

connectDB().then(() => {
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
});

