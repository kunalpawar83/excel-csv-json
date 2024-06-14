const express = require('express');
const user = express();
const multer = require('multer');
const path = require('path');
const bodyparser = require('body-parser');
const userCont = require('../controller/userCont.js');

user.use(bodyparser.urlencoded({ extended: true }));
user.use(bodyparser.json());

user.use(express.static(path.resolve(__dirname, 'public')));

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

user.post('/upload/csv', upload.single('user_data'), userCont.addUserCsv);
user.post('/upload',upload.single('user_data'),userCont.addUser);
//user.post('/upload/excel',upload.single('user_data'),userCont.addUserExcel);
user.get('/data', userCont.getAllData);
module.exports = user;

