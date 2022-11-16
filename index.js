const app = require('./app');
const connectDb = require('./config/db');


//connet to Database
connectDb()



//listen to server
app.listen(process.env.PORT, () =>{
    console.log(`Server running at port ${process.env.PORT}`);
})