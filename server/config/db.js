import mongoose from 'mongoose';

const connectToDatabase = async () => {
  try {
    mongoose.set("strictQuery", true);
    const database = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to the database: ${database.connection.host}`);
  }catch(error){
    console.error(error);
    process.exit(1);
  }
}

export default connectToDatabase;