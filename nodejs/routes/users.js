let logNameSpace = 'R.users';
var dlog = require('../lib/debuggers')(logNameSpace);
var log = require('../lib/log');
var cUser = require('../constants/dbConsts').user;
var cMess = require('../constants/messages.js');
var f = require('../lib/helperFunc');

const express = require('express');
const router = express.Router();
//const passport = require('passport');
//const jwt = require('jsonwebtoken');

const User = require('../models/user');

var msg = '';

// localhost:3000/users/<...>

// GET => localhost:<PORT>/user/
router.get('/all', (req,res) => {

  dlog.http('/all');

  User.getUsers((err,docs) => {
    if (err) {
      msg = cMess.mText(cMess.mCode.READ_ERR, cUser.coll);
      dlog.db3(msg);
      dlog.e(err);

      res.json({success: false,
                msg: msg,
                errMsg: err})
    }
    else {
      var len = f.jsLen(docs);
      if ( f.jsIsEmtpy(docs, len ) ) {
        msg = cMess.mText(cMess.mCode.READ_FAIL, cUser.coll);
      } else {
        msg = cMess.mText(cMess.mCode.READ_SUCC, cUser.coll);
      }

      dlog.db3(msg);
      dlog.db3(log.js(docs));
      res.json({success: true,
                msg: msg,
                count: len,
                docs: docs})
    }
  });
});

// Register
router.post('/register',(req,res,next) => {
  dlog.http('/register');
  dlog.http2(log.js(req.body));

  let newUser = new User({
    [cUser.fName] : req.body[cUser.fName],
    [cUser.fEmail] : req.body[cUser.fEmail],
    [cUser.fPassword] : req.body[cUser.fPassword],
    [cUser.fUserType_id] : req.body[cUser.fUserType_id]
  });

  User.addUser(newUser,(err, doc) => {
    if (err) {
      msg = cMess.mText(cMess.mCode.CR_ERR, cUser.coll);
      dlog.db3(msg);
      dlog.e(err);

      res.json({success: false,
                msg: msg,
                errMsg: err})
    } else {
      msg = cMess.mText(cMess.mCode.CR_SUCC, cUser.coll);
      dlog.db3(msg);
      dlog.l2(log.js(doc));
      res.json({success: true,
                msg: msg,
                doc: doc})
    }
  });
})

// Authenticate
router.post('/authenticate',(req,res,next) => {
  dlog.http('/authenticate');
  dlog.http2(log.js(req.body));

  const fEmail= req.body[cUser.fEmail];
  const fPassword = req.body[cUser.fPassword];

  User.getUserByEmail(fEmail, (err,user) => {
    if (err) {
      msg = cMess.mText(cMess.mCode.READ_FAIL, cUser.coll, cUser.fEmail);
      dlog.db3(msg);
      dlog.e(err);

      res.json({success: false,
                msg: msg,
                errMsg: err})
    }
    else if (!user) {
      msg = cMess.mText(cMess.mCode.READ_FAIL, cUser.coll, cUser.fEmail);
      dlog.db2(msg);

      msg = cMess.mText(cMess.mCode.INCORRECT_CREDENTIALS,
                              cUser.fEmail);
      dlog.db2(msg);

      res.json({success: false,
                msg: msg,
                errMsg: ""})
    } else {
      User.comparePassword(fPassword, user[cUser.fPassword], (err,isMatch) => {
        if ( err ) {
          // TODO_FA Stringify isn't working on err, seems like the contents (looks like a stack trace)
          // messes it up
          // test by providing no password
          //TODO_FA err is not getting populated in the res msg below
          msg = cMess.mText(cMess.mCode.CMP_PASS_ERR, err);
          dlog.w(msg);
          dlog.e(err);

          res.json({success: false,
                    msg: msg,
                    errMsg: err});
        } else if (isMatch) {
        //    const token = jwt.sign({data:user}, config.secret, {
        //       expiresIn: 604800 // 1 week worth of seconds
        //});
         // res.json({
         //   success: true,
         //   //token: 'JWT ' + token,
         //   user: {
         //   id: user._id,
         //   name: user.name,
         //   email: user.email
         //   }
          msg = cMess.mText(cMess.mCode.CORRECT_CREDENTIALS,
                                  cUser.coll);
          dlog.db2(msg);
          res.json({success: true,
                    msg: msg,
                    doc: user});
          } else {
            msg = cMess.mText(cMess.mCode.INCORRECT_CREDENTIALS,
                                    cUser.fPassword);
            res.json({success: false,
                      msg: msg,
                      errMsg: ""})
        }
      })
    }
  });
});

// Profile
//router.get('/profile',passport.authenticate('jwt', {session: false}), (req,res,next) => {
//  res.json({user: req.user});
//});

module.exports = router;