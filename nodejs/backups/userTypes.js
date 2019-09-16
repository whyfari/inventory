
const express = require('express');
const router = express.Router();
//const passport = require('passport');
//const jwt = require('jsonwebtoken');

const config = require('../config/database');
const UserType = require('../models/userType');

// localhost:<PORT>/userTypes/<...>

// GET => localhost:<PORT>/userTypes/
router.get('/all', (req,res) => {
  
  console.log('Processing GET all userTypes');
  //UserType.find((err,docs) => {
  UserType.getUserTypes((err,docs) => {
    if (err) {
        console.log('GET error while getting all userTypes' +
        JSON.stringify(err,undefined,2));
        res.send(docs);
        res.json({success: false,
                  msg: '_FA_ Failed to get all userTypes',
                  message : err})
    }
    else {
       console.log('GET got all userTypes');
       console.log(JSON.stringify(docs));
       res.json({success: true,
                 msg: '_FA_ got all userTypes',
                 docs: docs})
    }
    console.log('\n');
    });
  console.log('\n');
});

// Register
router.post('/add',(req,res,next) => {

    console.log('POST /register userType func');
    let newUserType = new UserType({
        code: req.body.code,
        description: req.body.description
    });

    UserType.addUserType(newUserType,(err, doc) => {
        if (err) {
            console.log('POST Error in adding new userType : ' +
            JSON.stringify(err,undefined,2));
            res.json({success: false,
                      msg: '_FA_ Failed to register userType',
                      message : err})
        } else {
            console.log('POST new userType added:');
            console.log(JSON.stringify(doc));
            res.json({success: true,
                      msg: '_FA_ UserType registed',
                      doc: doc})
        }
    });
})


// Profile 
//router.get('/profile',passport.authenticate('jwt', {session: false}), (req,res,next) => {
//    res.json({userType: req.userType});
//});

module.exports = router;