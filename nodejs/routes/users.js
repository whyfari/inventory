let logNameSpace = 'R.users';
var dlog = require('../lib/debuggers')(logNameSpace);
var log = require('../lib/log');
var cDb= require('../constants/dbConsts');
var cThis = cDb.user;
var cMess = require('../constants/messages.js');
var f = require('../lib/helperFunc');
const fkCheck = require('../models/dbHelperFunc').fkCheck;
var v = require('./validation');
const { check, validationResult } = require('express-validator');

const express = require('express');
const router = express.Router();
//const passport = require('passport');
//const jwt = require('jsonwebtoken');

const User = require('../models/user');

var msg = '';

// localhost:3000/users/<...>

// GET => localhost:<PORT>/user/
router.get('/all', (req,res) => {
  dlog.http(req.method + ' ' + req.originalUrl);

  User.getAll((err,docs) => {
    if (err) {
      msg = cMess.mText(cMess.mCode.READ_ERR, cThis.coll);
      dlog.db3(msg);
      dlog.e(err);

      res.json({success: false,
                msg: msg,
                errMsg: err})
    }
    else {
      var len = f.jsLen(docs);
      if ( f.jsIsEmpty(docs, len ) ) {
        msg = cMess.mText(cMess.mCode.READ_NONE, cThis.coll);
      } else {
        msg = cMess.mText(cMess.mCode.READ_SUCC, cThis.coll);
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
router.post('/register',
  [
    check([cThis.fName, cThis.fPassword], (value, { req, location, path}) => {
      return cMess.mText(cMess.mCode.ERR_FIELD_REQUIRED, path);
    }).
      trim().
      exists({checkFalsy: true}),
    check(cThis.fEmail,
      cMess.mText(cMess.mCode.ERR_FIELD_INVALID, cThis.fEmail)).
      trim().
      isEmail(),
    check(cThis.fUserType_id).
      trim().
      custom( value => {
        return fkCheck(cDb.userType.model, cDb.userType.fId, value, true);
      })

  ],
  (req,res,next) => {
  dlog.http(req.method + ' ' + req.originalUrl);
  dlog.http2('body: '+ log.js(req.body));

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    dlog.e(cMess.mText(cMess.mCode.ERR_REQ_VALIDATION, log.js(errors.array())));
    return res.status(422).json({ errors: errors.array() })
  }

  let newUser = new User({
    [cThis.fName] : req.body[cThis.fName],
    [cThis.fEmail] : req.body[cThis.fEmail],
    [cThis.fPassword] : req.body[cThis.fPassword],
    [cThis.fUserType_id] : req.body[cThis.fUserType_id]
  });

  User.add(newUser,(err, doc) => {
    if (err) {
      msg = f.getErrorMessage(err,cThis);
      dlog.db3(msg);
      dlog.e(err);

      //FIXME err (when bcrypt not mongoose error)
      // is empty when send back as a json object
      // it prints fine when just logging it
      res.json({success: false,
                msg: msg,
                errMsg: err})
    } else {
      msg = cMess.mText(cMess.mCode.CR_SUCC, cThis.coll);
      dlog.db3(msg);
      dlog.l2(log.js(doc));
      res.json({success: true,
                msg: msg,
                doc: doc})
    }
  });
})

// Authenticate
router.post('/auth',(req,res,next) => {
  dlog.http(req.method + ' ' + req.originalUrl);
  dlog.http2(log.js(req.body));

  const fEmail= req.body[cThis.fEmail];
  const fPassword = req.body[cThis.fPassword];

  User.getByEmail(fEmail, (err,user) => {
    if (err) {
      msg = cMess.mText(cMess.mCode.READ_FAIL, cThis.coll, cThis.fEmail);
      dlog.db3(msg);
      dlog.e(err);

      res.json({success: false,
                msg: msg,
                errMsg: err})
    }
    else if (!user) {
      msg = cMess.mText(cMess.mCode.READ_FAIL, cThis.coll, cThis.fEmail);
      dlog.db2(msg);

      msg = cMess.mText(cMess.mCode.CRED_FAIL, cThis.fEmail);
      dlog.db2(msg);

      res.json({success: false,
                msg: msg,
                errMsg: ""})
    } else {
      User.comparePassword(fPassword, user[cThis.fPassword], (err,isMatch) => {
        if ( err ) {
          // test by providing no password
          //TODO_FA err is not getting populated in the res msg below
          // it does get printed in logging
          // issue when being sent as a json string?
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
            msg = cMess.mText(cMess.mCode.CRED_SUCC,
                                    cThis.coll);
            dlog.db2(msg);
            res.json({success: true,
                      msg: msg,
                      doc: user});
          } else {
            msg = cMess.mText(cMess.mCode.CRED_FAIL,
                                    cThis.fPassword);
            dlog.w(msg);
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