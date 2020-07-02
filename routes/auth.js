const router = require('express').Router();
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { signupValidation, loginValidation } = require('../validation');


//Sign Up

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
	//to avoid sending the entire user details
	//res.send({user: user.id})
	//replaces the res.send(savedUser) and sends back only the id
    }catch(err){
    	res.status(400).send(err);
    }
});



//Log in 
router.post('/login', async (req,res) => {

	//Validate data before logging In
	const {error} = loginValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);
	//Check if the email exists
	const user = await User.findOne({
		email: req.body.email
	});
	if (!user) return res.status(400).send('Email does not exits');
	//check if password is correct
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if(!validPass) return res.status(400).send('Invalid Password');

	//create and assign a token
	const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
	res.header('auth-token', token).send(token);
	

})


module.exports = router;