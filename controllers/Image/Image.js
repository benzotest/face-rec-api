const imageHandler = (req,res,psql)=>{

	const {id} = req.body;
	console.log(id);

	psql('users')
	.where({
		id : id
	})
	.increment('entries', 1)
	.returning('entries')
	.then((data)=>{
		if(data.length){
			console.log(data)
			res.status(200).json({
				status: true,
				entries: data[0].entries
			})
		}
		else{
			res.status(404).json({
				status: false,
				message: "unable to increment"
			})
		}
	})
	.catch((err)=>{
		console.log(err)
		res.status(404).json({
				status: false,
				message: "unable to increment"
			})
	})
}

module.exports = {
	imageHandler:imageHandler
}