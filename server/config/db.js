import mongoose from 'mongoose'
import colors from 'colors'

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database is connected to MongoDb ${mongoose.connection.host}`.bgMagenta.white);
    } catch (error) {
        console.log(`Mongo Db Error ${error}`.bgRed.white);
    }
}

export default connectDB