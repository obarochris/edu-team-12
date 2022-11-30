const app = require('./app');
const connectDb = require('./config/db');
require('dotenv').config();
const cloudinary = require('cloudinary');

//connet to Database
connectDb()

//cloudinary config goes in here
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


//listen to server
app.listen(process.env.PORT, () =>{
    console.log(`Server running at port ${process.env.PORT}`);
})