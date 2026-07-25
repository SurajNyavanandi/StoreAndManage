import mongoose from 'mongoose';

const database = async ()=>{
    try{
         if (!process.env.MONGO_URI) {
             console.log("MONGO_URI not set. Running in offline/demo database mode.");
             return;
         }
         await mongoose.connect(process.env.MONGO_URI, {
             serverSelectionTimeoutMS: 5000
         });
         console.log("Database connected");
    }catch(error){
        console.log("Error connecting to database : "+error.message);
    }
};

export default database;