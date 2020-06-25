const express = require('express');
const app = express();
const dotenv =require('dotenv');
const mongoose = require('mongoose');



//import route
const authRoute = require('./routes/auth');




dotenv.config();

// The database to use
 const dbName = "test";


//connect to db
mongoose.connect( process.env.DB_CONNECT, { useNewUrlParser: true }, () => console.log('DB connected!')
);


//middlewares
app.use(express.json());

//route middlewares
app.use('/api/user', authRoute);

app.listen(3000, () => console.log('Server Running..'));
