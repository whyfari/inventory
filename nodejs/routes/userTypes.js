var logNameSpace = 'R.userTypes';
var dlog = require('../lib/debuggers')(logNameSpace);

const express = require('express');
const router = express.Router();
//const passport = require('passport');
//const jwt = require('jsonwebtoken');

const UserType = require('../models/userType');

// localhost:<PORT>/userTypes/<...>

// GET => localhost:<PORT>/userTypes/
router.get('/all', (req,res) => {
  dlog.http('hehe' + req.method + ' ' + req.url);
  dlog.db('WOA WOA Processing GET all userTypes');
  //UserType.find((err,docs) => {
  UserType.getUserTypes((err,docs) => {
    if (err) {
        dlog.db('GET error while getting all userTypes' +
        JSON.stringify(err,undefined,2));
        res.send(docs);
        res.json({success: false,
                  msg: '_FA_ Failed to get all userTypes',
                  message : err})
    }
    else {
       dlog.db('GET got all userTypes' + 
            JSON.stringify(docs));
       res.json({success: true,
                 msg: '_FA_ got all userTypes',
                 docs: docs})
    }
    });
});

// Register
//TODO_FA confirm user dne, email unique should already work but jic?
router.post('/add',(req,res,next) => {

    dlog.fb('POST /register userType func');
    let newUserType = new UserType({
        code: req.body.code,
        description: req.body.description
    });

    UserType.addUserType(newUserType,(err, doc) => {
        if (err) {
            dlog.e('POST Error in adding new userType : ' +
            JSON.stringify(err,undefined,2));
            res.json({success: false,
                      msg: '_FA_ Failed to register userType',
                      message : err})
        } else {
            dlog.l2('POST new userType added:' + 
                     JSON.stringify(doc));

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