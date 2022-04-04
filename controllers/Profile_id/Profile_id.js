const profileHandler = (req,res,psql)=>{

	const {id} = req.params;

	psql('users')
	.where({
		id: id
	})
	.select('*')
	.then((user)=>{
		if(user[0].id){
			console.log(user)
			res.json({
				status: true,
				user: user[0]
			})
		}
		else{
			res.json({
				status: false,
				message: "unable to find user"
			})
		}
	})
	.catch((err)=>{
		console.log(err)
		res.json({
			status: false,
			message: "unable to find user"
		})
	})
}

module.exports = {
	profileHandler:profileHandler
}
