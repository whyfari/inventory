var logNameSpace = 'R.users';
var dlog = require('../lib/debuggers')(logNameSpace);

const express = require('express');
const router = express.Router();
//const passport = require('passport');
//const jwt = require('jsonwebtoken');

const config = require('../config/database');
const User = require('../models/user');

// localhost:3000/users/<...>

// GET => localhost:<PORT>/user/
router.get('/all', (req,res) => {

  dlog.l('Processing GET all users');

  //User.find((err,docs) => {
  User.getUsers((err,docs) => {
    if (err) {
        dlog.e('GET error while getting all users' +
        JSON.stringify(err,undefined,2));
        res.send(docs);
        res.json({success: false,
                  msg: '_FA_ Failed to get all users',
                  message : err})
    }
    else {
       dlog.l('GET got all users');
       dlog.l(JSON.stringify(docs));
       res.json({success: true,
                 msg: '_FA_ got all users',
                 docs: docs})
    }
    });
});

// Register
router.post('/register',(req,res,next) => {
    dlog.l('POST /register user func');
     
    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        typeId: req.body.typeId
    });

    User.addUser(newUser,(err, doc) => {
        if (err) {
            dlog.e('POST Error in adding new user : ' +
            JSON.stringify(err,undefined,2));
            res.json({success: false,
                      msg: '_FA_ Failed to register user',
                      message : err})
        } else {
            dlog.l('POST new user added:');
            dlog.l(JSON.stringify(doc));
            res.json({success: true,
                      msg: '_FA_ User registed',
                      doc: doc})
        }
    });
})

// Authenticate 
router.post('/authenticate',(req,res,next) => {
    const email= req.body.email;
    const password = req.body.password;

    dlog.http('authenticate');

    dlog.td('Add getUserByEmail');
    //User.getUserByUsername(username, (err,user) => {
    User.getUserByEmail(email, (err,user) => {
        if (err) {
            dlog.e('db error returned by getUserByUserName');
            return res.json({success: false, msg: err}); 
            //throw err;
        }
        else if (!user) {
            dlog.e('no db error but User object null in getUserByUserName');
            dlog.snh('why would the user object be null?')
            return res.json({success: false, msg: '_FA_ User not found'})
        } else {
            dlog.l('getUserByUserName, got one, now compare passwords, using: ' +
                    JSON.stringify(user));
            User.comparePassword(password, user.password, (err,isMatch) => {
                if ( err ) {
                    dlog.e('calling comparePassword returning err' + 
                            err);
                    //throw err;
                    //TODO_FA err is not getting populated in the res msg below
                    return res.json({success: false, msg: err}); 
                } else if (isMatch) {
                //    const token = jwt.sign({data:user}, config.secret, {
                //       expiresIn: 604800 // 1 week worth of seconds
                //});
                    res.json({
                        success: true,
                        //token: 'JWT ' + token,
                        user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                        }
                    })
                } else {
                    dlog.db('getUserByUserName incorrect @password');
                    return res.json({success: false, msg: '_FA_ Wrong password'});
                }
            })
        }
    });
});

// Profile 
//router.get('/profile',passport.authenticate('jwt', {session: false}), (req,res,next) => {
//    res.json({user: req.user});
//});

module.exports = router;