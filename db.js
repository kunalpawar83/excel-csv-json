const mongoose  = require('mongoose');
const connectDB = async () => {
    try {
      await mongoose.connect('mongodb+srv://kunalpawar8319:kunalmain2018@cluster0.wgaedti.mongodb.net/excel-json');
      console.log("MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  };
  
  
  module.exports = {connectDB};
//mongoose.connect('mongodb://localhost:27017/excel-json');