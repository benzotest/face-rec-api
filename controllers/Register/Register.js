const registerHandler = (req,res,psql)=>{

	const {email,name,password} = req.body;

	if((!email.length || !password.length || !name.length) ||
		(!email.includes("@",) || !email.includes("."))){
		console.log("nope")
		return res.json({
			status: "nope"
		})
	}
	
	console.log("hash",password)
	psql.transaction((trx)=>{
		trx('login2')
		.insert({
			hash: password,
			email: email
		})
		.returning('email')
		.then((data)=>{
			console.log(data[0].email, "should be email")
			return(
				trx('users')
				.insert({
					name: name,
					email: data[0].email,
					joined: new Date()
				})
				.returning('*')
			)
		})
		.then((data)=>{
			console.log(data[0], "should be profile")
			if(data.length){
				return(
					res.status(200).json({
						status: true,
						user: data[0]
					})
				)
			}
			else{
				return(
					res.status(404).json({
						status: false,
						message: "unable to register"
					})
				)
			}
		})
		.catch((err)=>{
			res.json(err)
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})	
}

module.exports = {
	registerHandler: registerHandler
}

