const express= require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
var bodyParser = require('body-parser');
const config = require('./config/database') 
const app = express();
const passport = require('passport');



const users = require('./routes/users');

const port = 3000;

mongoose.connect(config.database,{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.on('connection',()=>{
    console.log('connected to database'+config.database);
});

mongoose.connection.on('error',(err)=>{
    console.log('database error'+err);
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users',users);

app.use(express.static(path.join(__dirname,'./angular/dist/angular')));
app.get('/',(req,res)=>{
    res.send('invalid endpoint');
});

app.listen(port,()=>{
    console.log('server started at port:',port);
});