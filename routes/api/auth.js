const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator/check');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../../models/Users');
const config = require('config');
const bcrypt = require('bcryptjs');

//@route GET api/auth
//@desc Test route
//@access Public
router.get('/', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        await res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//@route GET api/auth
//@desc Authenticate User @ get token
//@access Public
router.post('/',[

    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    // res.send('User route')

    const {name, email, password} = req.body;

    try{
        //see if the user exists
        let user = await User.findOne({email});
        if (!user){
            res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({errors:[{msg:'Invalid Credentials'}]})
        }

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

        res.send('Login Successfully') // Easy for postman check
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }

});


module.exports = router;
