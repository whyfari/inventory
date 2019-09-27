var logNameSpace = 'R.userTypes';
var dlog = require('../lib/debuggers')(logNameSpace);
var cUserType = require('../constants/dbConsts').userType;

const express = require('express');
const router = express.Router();
//const passport = require('passport');
//const jwt = require('jsonwebtoken');

const UserType = require('../models/userType');

// localhost:<PORT>/userTypes/<...>

// GET => localhost:<PORT>/userTypes/
router.get('/all', (req,res) => {
  dlog.http(req.method + ' ' + req.url);

  UserType.getUserTypes((err,docs) => {
    if (err) {
      dlog.db('GET error while getting all userTypes' +
                err);
      res.json({success: false,
        msg: '_FA_ Failed to get all userTypes',
        message : err})
    }
    else {
      dlog.db('GET got all userTypes');
      dlog.db2(JSON.stringify(docs, null, 2));
      res.json({success: true,
                msg: '_FA_ got all userTypes',
                docs: docs})
    }
    });
});

// Register
//TODO_FA confirm user dne, email unique should already work but jic?
router.post('/add',(req,res,next) => {
  dlog.http(req.method + ' ' + req.url);

  fCode = 'code';

  let newUserType = new UserType({
    [cUserType.fCode] : req.body[cUserType.fCode],
    [cUserType.fDesc] : req.body[cUserType.fDesc]
  });

  UserType.addUserType(newUserType,(err, doc) => {

    if (err) {

      dlog.e('POST Error in adding new userType' +
        err);

        res.json({success: false,
          msg: 'Failed to register userType',
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
//  res.json({userType: req.userType});
//});

module.exports = router;