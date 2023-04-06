const express = require("express");
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const knex = require('knex');

const psql = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'facerec'
  }
});


app.use(cors());
app.use(bodyParser.json());

app.get("/", (req,res)=>{

	psql.select('*')
	.from('users')
	.then((data)=>{
		console.log(data);
		res.json({
			status:"its working",
			users: data
		})
	})

})

app.post("/signin", (req,res)=>{

	const {email, password} = req.body;

	if(email && password){

		psql('login')
		.where({
			email: email
		})
		.select('hash')
		.then((data)=>{
			console.log(data[0].hash);
			const comparePassword = bcrypt.compareSync(password, data[0].hash);
			console.log(comparePassword)
			if(comparePassword){
				return(
					res.status(200).json({
						status: "success"
					})
				)
			}
			else{
				return(
					res.status(404).json("wrong password given")
				)
			}
		})
		.catch((err)=>{
			console.log(err)
			return(
				res.status(404).json("error doing sign in")
			)
		})
	}
	else{
		return(
			res.status(404).json("no email or passord given ")
		)
	}
})

app.post("/register", (req,res)=>{

	if(req.body.name && req.body.email && req.body.password){

		const {name,email,password} = req.body;

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		console.log(hash)

		psql.transaction((trx)=>{
			trx('login')
			.returning('email')
			.insert({
				email: email,
				hash: hash
			})
			.then((data)=>{
				console.log(data[0].email)
				return(
					trx('users')
					.returning('*')
					.insert({
						email: data[0].email,
						name: name,
						joined: new Date()
					})
				)
			})
			.then((data)=>{
				console.log(data[0])
				return(
					res.status(200).json({
						status: "success",
						result: data[0]
					})
				)
			})
			.catch((err)=>{
				console.log(data)
				return(
					res.status(404).json('error entering details in database')
				) 
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
	}
	else{
		return(
			res.status(404).json("REGISTER FAILED!! NO PASSQORD,EMAIL OR NAME")
		)
	}
})

app.get("/profile/:id", (req,res)=>{

	if(req.params.id){

		const {id} = req.params;
		
		psql('users')
		.where({
			id: id
		})
		.select('*')
		.then((data)=>{
			if(data.length > 0){
				console.log(data, data.length);
				return(
					res.status(200).json({
						status: 'success',
						user: data[0]
					})
				) 

			}
			else{
				console.log(data, data.length);
				return(
					res.status(404).json({
						status: 'fail couldnt find a user'
					})
				) 
			}
		})
		.catch((err)=>{
			console.log(err)
			return(
				res.status(404).json({
					status: 'fail error in code finding user'
				})
			) 
		})
			
	}
	else{
		return res.status(404).json("fail no id given")
	}
})

app.put("/image",(req,res)=>{
 	const {id} = req.body;

	if(id){
		psql('users')
		.where({
			id : id
		})
		.increment('entries', 1)
		.returning('entries')
		.then((data)=>{
			console.log(data[0].entries)
			return(
				res.status(200).json({
 					status: 'success',
					entries: data[0].entries
				})
			)
		})
		.catch((err)=>{
			return(
				res.status(404).json({
					status: 'fail couldnt increment'
				})
			)
		})
	}
	else{
		return(
			res.status(404).json("error no id given")
		)
	}
})


app.listen(3001,()=>{
	console.log("server running on port 3001")
})