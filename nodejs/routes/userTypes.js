var logNameSpace = 'R.userTypes';
var dlog = require('../lib/debuggers')(logNameSpace);
var log = require('../lib/log');
var f = require('../lib/helperFunc');
const dbF= require('../models/dbHelperFunc');
const cHttp= require('../constants/consts').cHttp;
var cDb= require('../constants/dbConsts');
var cThis = cDb.userType;
var cMess = require('../constants/messages.js');

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
//const passport = require('passport');
//const jwt = require('jsonwebtoken');

const UserType = require('../models/userType');

router.get('/all', (req,res) => {
  UserType.getAll((err,docs) => {
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

router.post('/add',
  [
    check(cThis.fCode, (value, { req, location, path}) => {
      return cMess.mText(cMess.mCode.ERR_FIELD_REQUIRED, path);
    }).
      trim().
      exists({checkFalsy: true}).
      custom( value => {
        return dbF.checkDbField(cThis.model,cThis.fCode,cThis.fCode, value, false, false);
      })
  ],
  (req,res,next) => {

  dlog.http2('body: ' + log.js(req.body));

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    dlog.e(cMess.mText(cMess.mCode.ERR_REQ_VALIDATION, log.js(errors.array())));

    res.status(cHttp.Unprocessable);
    return res.json({ errors: errors.array() })
  }

  let newUserType = new UserType({
    [cThis.fCode] : req.body[cThis.fCode],
    [cThis.fDesc] : req.body[cThis.fDesc]
  });

  UserType.add(newUserType,(err, doc) => {
    if (err) {

      msg = f.getErrorMessage(err, cThis);
      dlog.db3(msg);
      dlog.e(err);

      res.status(cHttp.IntServerErr);
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


// Profile
//router.get('/profile',passport.authenticate('jwt', {session: false}), (req,res,next) => {
//  res.json({userType: req.userType});
//});

module.exports = router;