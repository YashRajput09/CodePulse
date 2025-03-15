import mongoose from "mongoose";
import mongoStore from "connect-mongo";
import dbgr from "debug";

const debugMongoose = dbgr("development:mongoose");

const dburl = process.env.MONGODB_ATLUS_URL;
mongoose.connect(dburl, {
    connectTimeoutMS: 30000 //30 seconds connection timeout
})
.then(() =>{
    debugMongoose("connected");
})
.catch((error) =>{
    console.log("Error connecting to mongoDB : ", error);
});

const store = mongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

export { store };
export default mongoose.connection;