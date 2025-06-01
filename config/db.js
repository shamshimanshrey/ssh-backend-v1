const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            
        })
        console.log("mongo Connected")
    } catch (error) {
console.error("not connected by mongo", error.message);
process.exit(1);
    }
}

module.exports = connectDB;



{}