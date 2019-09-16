
const express = require('express');
const router = express.Router();
//const passport = require('passport');
//const jwt = require('jsonwebtoken');

const config = require('../config/database');
const User = require('../models/user');

// localhost:3000/users/<...>

// GET => localhost:<PORT>/user/
router.get('/all', (req,res) => {
  
  console.log('Processing GET all users');
  //User.find((err,docs) => {
  User.getUsers((err,docs) => {
    if (err) {
        console.log('GET error while getting all users' +
        JSON.stringify(err,undefined,2));
        res.send(docs);
        res.json({success: false,
                  msg: '_FA_ Failed to get all users',
                  message : err})
    }
    else {
       console.log('GET got all users');
       console.log(JSON.stringify(docs));
       res.json({success: true,
                 msg: '_FA_ got all users',
                 docs: docs})
    }
    console.log('\n');
    });
  console.log('\n');
});

// Register
router.post('/register',(req,res,next) => {
    console.log('POST /register user func');
     
    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        type: req.body.type
    });

    User.addUser(newUser,(err, doc) => {
        if (err) {
            console.log('POST Error in adding new user : ' +
            JSON.stringify(err,undefined,2));
            res.json({success: false,
                      msg: '_FA_ Failed to register user',
                      message : err})
        } else {
            console.log('POST new user added:');
            console.log(JSON.stringify(doc));
            res.json({success: true,
                      msg: '_FA_ User registed',
                      doc: doc})
        }
    });
})

// Authenticate 
router.post('/authenticate',(req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err,user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: '_FA_ User not found'})
        }

        User.comparePassword(password, user.password, (err,isMatch) => {
            if ( err ) throw err;
            if (isMatch) {
            //    const token = jwt.sign({data:user}, config.secret, {
             //       expiresIn: 604800 // 1 week worth of seconds
                //});
                res.json({
                    success: true,
           //         token: 'JWT ' + token,
                    user: {
                       id: user._id,
                       name: user.name,
                       email: user.email
                    }
                })
            } else {
                return res.json({success: false, msg: '_FA_ Wrong password'});
            }
        })
    });
});

// Profile 
//router.get('/profile',passport.authenticate('jwt', {session: false}), (req,res,next) => {
//    res.json({user: req.user});
//});

module.exports = router;