const User = require('../models/user.model');
const csv = require('csvtojson');
const fs = require('fs').promises;
const XLSX = require('xlsx');
const path = require('path');


exports.getAllData = async (req, res) => {
    const data = await User.find();
    res.json(data);
    };
    
// Upload JSON file
exports.addUser = async (req, res) => {
    try {
        const files = req.files; 
        // Retrieve array of files
        console.log(files);
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const results = [];

        for (const file of files) {
            const fileName = file.filename.split(".").pop().toLowerCase();
            const filePath = path.resolve(file.path);

            if (fileName === "json") {
                // Read the uploaded JSON file
                const jsonData = await fs.readFile(filePath, 'utf-8');
                // Parse the JSON data
                const parsedData = JSON.parse(jsonData);
                // Insert into MongoDB
                const newData = await User.insertMany(parsedData);
                results.push({ file: file.originalname, message: 'JSON data uploaded successfully', data: newData });
            } 
            else if (fileName === "csv") {
                const jsonObj = await csv().fromFile(filePath);
                const users = jsonObj.map(user => ({
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile
                }));
                const data = await User.insertMany(users);
                results.push({ file: file.originalname, message: 'CSV data uploaded successfully', data });
            } 
            else if (fileName === "xlsx") {
                const fileBuffer = await fs.readFile(filePath);
                const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                const data = await User.insertMany(jsonData);
                results.push({ file: file.originalname, message: 'Excel data uploaded successfully', data });
            } 
            else {
                results.push({ file: file.originalname, message: 'Unsupported file type' });
            }
        }

        res.json({
            message: 'Files processed successfully',
            results
        });
    } catch (err) {
        console.error('Error uploading data:', err);
        res.status(500).json({ message: 'Error: ' + err.message });
    }
};
//Upload CSV file
// exports.addUserCsv = async (req, res) => {
//     try{
//         csv().fromFile(req.file.path).then((jsonObj)=>{
//             const users = jsonObj.map(user => {
//                 return new User({
//                     name: user.name,
//                     email: user.email,
//                     mobile: user.mobile
//                 });
//             });
//             User.insertMany(users).then((data)=>{
//                 console.log(data);
//             }).catch((err)=>{
//                 console.log(err);
//             });
//         })

//         res.status(200).json({message: 'Data uploaded successfully'});
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: 'Error uploading data'});
//     }
// };

// // Upload Excel file
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

