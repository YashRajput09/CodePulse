import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
const app = express();

const port = process.env.PORT ;
const dburl = process.env.MONGODB_ATLUS_URL;
async function dbConnection() {

    try{
        await mongoose.connect(dburl);
        console.log("connected");
    } catch( err ){
        console.log(err);
    }
    app.listen(port, () =>{
        console.log(`Listening on port: ${port}`);
    });
}
dbConnection();

app.use('/', (req, res) => {
    res.send('CodePulse By Us For You :)');
})