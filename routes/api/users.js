const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator/check');
const User = require('../../models/Users');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const normalized = require('normalize-url');


//@route GET api/users
//@desc Register User
//@access Public
router.post('/',[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min:6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    // res.send('User route')

    const {name, email, password} = req.body;

    try{
        //see if the user exists
        let user = await User.findOne({email});
        if (user){
            res.status(400).json({errors:[{msg:'User already exists'}]});
        }
        //get users gravatar
        const avatar = normalized(gravatar.url(email, {
            s:'200', //size
            r:'pg', //rating
            d:'mm' //default image
        }), {forceHttps:true});

        user = new User({
                name,
                email,
                avatar,
                password
        });

        //Emcrypt the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        //return the json web token
        await user.save();

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 36000},
            (err, token) => {
                if(err) throw err;
                res.json({token}); //send the token back to the client
            }
            );

        // res.send('User Registered') // Easy for postman check
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }

});


module.exports = router;
