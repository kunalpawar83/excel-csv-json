const User = require('../models/user.model');
const csv = require('csvtojson');
const fs = require('fs').promises;
const XLSX = require('xlsx');
const path = require('path');
// Upload JSON file
exports.addUser= async (req, res) => {
    const file  = req.file.originalname;
    let filename  = file.split('.')[1];
    console.log(filename);
    try {
        if(filename == 'json'){
        // Read the uploaded JSON file
        const jsonData = await fs.readFile(req.file.path, 'utf-8');
        // Parse the JSON data
        const parsedData = JSON.parse(jsonData);
        // Create a new document in the MongoDB collection
        const newData =  await User.insertMany(parsedData);
        res.json({ 
            message: 'Data uploaded successfully!',
            data: newData
        });
        }
        else if(filename == 'csv'){
            csv().fromFile(req.file.path).then((jsonObj)=>{
                const users = jsonObj.map(user => {
                    return new User({
                        name: user.name,
                        email: user.email,
                        mobile: user.mobile
                    });
                });
                User.insertMany(users).then((data)=>{
                    console.log(data);
                }).catch((err)=>{
                    console.log(err);
                });
            })
            res.status(200).json({message: 'Data uploaded successfully'});
        }
        else if (filename == 'xlsx'){
            const filePath = path.resolve(req.file.path);
            const file = await fs.readFile(filePath);
    
            // Parse the Excel file
            const workbook = XLSX.read(file, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
    
            // Insert parsed data into MongoDB
            const data = await User.insertMany(jsonData);
            res.json({ 
                message: 'Data uploaded successfully!',
                data: data
            });
        }
      } catch (err) {
        console.error('Error uploading data:', err);
        res.status(500).json({ message: 'Error: ' + err.message });
      }
};

exports.getAllData = async (req, res) => {
    const data = await User.find();
    res.json(data);
};

//Upload CSV file
exports.addUserCsv = async (req, res) => {
    try{
        csv().fromFile(req.file.path).then((jsonObj)=>{
            const users = jsonObj.map(user => {
                return new User({
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile
                });
            });
            User.insertMany(users).then((data)=>{
                console.log(data);
            }).catch((err)=>{
                console.log(err);
            });
        })

        res.status(200).json({message: 'Data uploaded successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error uploading data'});
    }
};

// Upload Excel file
// exports.addUserExcel = async (req, res) => {
//     try{
//             const filePath = path.resolve(req.file.path);
//             const file = await fs.readFile(filePath);
    
//             // Parse the Excel file
//             const workbook = XLSX.read(file, { type: 'buffer' });
//             const sheetName = workbook.SheetNames[0];
//             const sheet = workbook.Sheets[sheetName];
//             const jsonData = XLSX.utils.sheet_to_json(sheet);

//             // Insert parsed data into MongoDB
//             const data = await User.insertMany(jsonData);
//             res.json({ 
//                 message: 'Data uploaded successfully!',
//                 data: data
//             });
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: 'Error uploading data'});
//     }
// };

