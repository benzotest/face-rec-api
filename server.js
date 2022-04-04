const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
const path = require("path");
const bcryptjs = require('bcryptjs');
const knex = require('knex');

const SignIn = require('./controllers/SignIn/SignIn.js');
const Register = require('./controllers/Register/Register.js');
const Image = require('./controllers/Image/Image.js');
const Profile = require('./controllers/Profile_id/Profile_id.js');


const psql = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'ben',
    password : '',
    database : 'test'
  }
})

const whitelist = ['http://localhost:3001']
const corsOptions = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(bodyParser.json());
app.use(cors(corsOptions));


app.get('/', (req, res) =>{
	// psql.select("*")
	// .from("users")
	// .then((data)=>{
	// 	console.log(data)
	// 	res.json(data)
	// })
  //res.sendFile(path.join(__dirname, '/index.html'));
  res.json("hi")
});

app.post("/signin", (req,res)=>{SignIn.signInHandler(req,res,bcryptjs,psql)})
	
app.post("/register", (req,res)=>{Register.registerHandler(req,res,psql)})

app.get("/profile/:id", (req,res)=>{Profile.profileHandler(req,res,psql)})

app.put("/image", (req,res)=>{Image.imageHandler(req,res,psql)})

console.log(process.env.PORT)

app.listen(process.env.PORT || 3000,()=>{
	console.log(`app is running on port ${process.env.PORT}`)
})

