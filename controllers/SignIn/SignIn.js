const signInHandler = (req,res,bcryptjs,psql )=>{
	const {email, password} = req.body;
	console.log(email)
	psql('login2')
	.where({
		email: email
	})
	.select('hash', 'email')
	.then((data)=>{
		if(data.length){
			console.log(data)
			const isPasswordValid = bcryptjs.compareSync(password, data[0].hash)
			console.log(isPasswordValid)
			if(isPasswordValid){
				psql('users')
				.where({
					email: email
				})
				.select('*')
				.then((data)=>{
					console.log(data[0])
					res.json({
						status: true,
						user:data[0]
					})
				})
				.catch((err)=>{
					res.json({
						status: false,
						message: "error with email or password"
					})
				})
			}
			else{
				res.json({
						status: false,
						message: "error with email or password"
				})
			}
		}
		else{
				console.log(data)
				res.json({
					status: false,
					message: "error with email or password"
				})
		}
	})
}

module.exports={
	signInHandler: signInHandler
}

