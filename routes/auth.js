const router = require('express').Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const { signupValidation, loginValidation } = require('../validation');



router.post('/signup', async (req, res) => {

	//lets validate the data before creating a user
	const {error} = signupValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	//check if user email already exists
	const emailExist = await User.findOne({
		email: req.body.email
	});
	if(emailExist) return res.status(400).send('Email already exits');
	

	//Hash the Password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	//create a new user
		const user =  new User({
    	name: req.body.name,
    	email: req.body.email,
    	password: hashedPassword
	});
	
   //try to submit and catch errors
    try{
    	const savedUser = await user.save();
    	res.send(savedUser);
    }catch(err){
    	res.status(400).send(err);
    }
});


module.exports = router;