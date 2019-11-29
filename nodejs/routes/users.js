let logNameSpace = 'R.users';
var dlog = require('../lib/debuggers')(logNameSpace);
var log = require('../lib/log');
const cHttp= require('../constants/consts').cHttp;
var cDb= require('../constants/dbConsts');
var cThis = cDb.user;
var cMess = require('../constants/messages.js');
var f = require('../lib/helperFunc');
const dbF= require('../models/dbHelperFunc');
const routeFuncs = require('./validation');
var v = require('./validation');

const express = require('express');
const router = express.Router();
const { check, oneOf, validationResult } = require('express-validator');
//const passport = require('passport');
//const jwt = require('jsonwebtoken');

const User = require('../models/user');

var msg = '';

router.get('/all', (req,res) => {
  User.getAll((err,docs) => {
    if (err) {
      msg = cMess.mText(cMess.mCode.READ_ERR, cThis.coll);
      dlog.db3(msg);
      dlog.e(err);
      res.status(cHttp.IntServerErr);

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

router.post('/register',
  routeFuncs.requireNoLogin,
  [
    check([cThis.fName, cThis.fPassword], (value, { req, location, path}) => {
      return cMess.mText(cMess.mCode.ERR_FIELD_REQUIRED, path);
    }).
      trim().
      exists({checkFalsy: true}),
    check(cThis.fEmail,
      cMess.mText(cMess.mCode.ERR_FIELD_INVALID, cThis.fEmail)).
      trim().
      isEmail().
      bail().
      custom( value => {
        return dbF.checkDbField(cThis.model, cThis.fEmail,cThis.fEmail, value, false, false);
      }),
    check(cThis.fUserType_id).
      trim().
      custom( value => {
        return dbF.checkDbField(cDb.userType.model, cDb.userType.fId, cThis.fUserType_id, value, true, false);
      })
  ],
  (req,res,next) => {


  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    dlog.e(cMess.mText(cMess.mCode.ERR_REQ_VALIDATION, log.js(errors.array())));
    res.status(cHttp.Unprocessable);
    return res.json({ errors: errors.array() })
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

      res.status(cHttp.IntServerErr);
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
});

router.post('/login',
  routeFuncs.requireNoLogin,
  [
    check(cThis.fPassword, (value, { req, location, path}) => {
      return cMess.mText(cMess.mCode.ERR_FIELD_REQUIRED, path);
    }).
      trim().
      exists({checkFalsy: true}),
    check(cThis.fEmail,
      cMess.mText(cMess.mCode.ERR_FIELD_INVALID, cThis.fEmail)).
      trim().
      isEmail().
      bail().
      custom( value => {
        return dbF.checkDbField(cThis.model, cThis.fEmail,cThis.fEmail, value, true, false);
      })
  ],
  (req,res,next) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    dlog.e(cMess.mText(cMess.mCode.ERR_REQ_VALIDATION, log.js(errors.array())));
    res.status(cHttp.Unprocessable);
    return res.json({ errors: errors.array() })
  }

  const fEmail= req.body[cThis.fEmail];
  const fPassword = req.body[cThis.fPassword];

  User.getByEmail(fEmail, (err,user) => {
    if (err) {
      msg = cMess.mText(cMess.mCode.READ_FAIL, cThis.coll, cThis.fEmail);
      dlog.db3(msg);
      dlog.e(err);

      res.status(cHttp.IntServerErr);
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
      dbF.compHash(fPassword, user[cThis.fPassword], (err,isMatch) => {
        if ( err ) {
          // test by providing no password
          //TODO_FA err is not getting populated in the res msg below
          // it does get printed in logging
          // issue when being sent as a json string?
          msg = cMess.mText(cMess.mCode.CMP_PASS_ERR, err);
          dlog.w(msg);
          dlog.e(err);

          // even if password was incorrect it shouldn't error
          // it can error if we send over no values and such
          // which we should not be doing
          res.status(cHttp.IntServerErr);
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
            req.session.userId= user[cThis.fId];
            dlog.f('session user id set : ' ,req.session.userId);
            res.json({success: true,
                      msg: msg,
                      doc: user});

          } else {
            msg = cMess.mText(cMess.mCode.CRED_FAIL,
                                    cThis.fPassword);
            dlog.w(msg);
            res.status(cHttp.Unprocessable);
            res.json({success: false,
                      msg: msg,
                      errMsg: ""})
        }
      })
    }
  });
});

router.post('/logout',
  routeFuncs.requireLogin,
  [
    check(cThis.fEmail,
      cMess.mText(cMess.mCode.ERR_FIELD_INVALID, cThis.fEmail)).
      trim().
      isEmail()
  ],
  (req,res,next) => {

  dlog.fb('router.post /logout');
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    dlog.e(cMess.mText(cMess.mCode.ERR_REQ_VALIDATION, log.js(errors.array())));
    res.status(cHttp.Unprocessable);
    return res.json({ errors: errors.array() })
  } else {

    dlog.l(req.session)

    dlog.l(req.session.id) // ex: 0kVkUn7KUX1UZGnjagDKd_NPerjXKJsA

    // Note that the portion between 's%3A' and '.' is the session ID above.
    // 's%3A' is URL encoded and decodes to 's:'. The last part is the signature.
    // sid=s%3A0kVkUn7KUX1UZGnjagDKd_NPerjXKJsA.senfzYOeNHCtGUNP4bv1%2BSdgSdZWFtoAaM73odYtLDo
    dlog.l(req.get('cookie'))

    // Upon logout, we can destroy the session and unset req.session.
    req.session.destroy(err => {
      // We can also clear out the cookie here. But even if we don't, the
      // session is already destroyed at this point, so either way, they
      // won't be able to authenticate with that same cookie again.
     // res.clearCookie('connect.sid')
    });

    msg = cMess.mText(cMess.mCode.LOG_OUT_SUCC, req.body[cThis.fEmail]);

    res.json({success: true,
              msg: msg,
              doc: {}});
  }

  });

// user must be logged in (not an admin changing other users)
router.put('/edit',
  routeFuncs.requireLogin,
  [
    check([cThis.fName, cThis.fPassword], (value, { req, location, path}) => {
      return cMess.mText(cMess.mCode.ERR_FIELD_REQUIRED, path);
    }).
      optional().
      trim().
      exists({checkFalsy: true}),
    check(cThis.fEmail,
      cMess.mText(cMess.mCode.ERR_FIELD_INVALID, cThis.fEmail)).
      trim().
      optional().
      isEmail().
      bail().
      custom( value => {
        return dbF.checkDbField(cThis.model, cThis.fEmail,cThis.fEmail, value, false, false);
      }),
    check(cThis.fUserType_id).
      optional().
      trim().
      custom( value => {
        return dbF.checkDbField(cDb.userType.model, cDb.userType.fId, cThis.fUserType_id, value, true, false);
      })
  ],
  (req,res,next) => {

  const errors = validationResult(req)
  if ( !errors.isEmpty() ) {
    //msg = cMess.mText(cMess.mCode.ERR_REQ_VALIDATION, (errors.array()));
    // FIXME error expects errors list
    msg = cMess.mText(cMess.mCode.ERR_REQ_VALIDATION);
    dlog.e(msg);
    res.status(cHttp.Unprocessable);
    return res.json({success: false,
                      msg: msg,
                      errMsg:errors.array()});
  } else if ( req.body[cThis.fId] &&
              req.body[cThis.fEmail] ) {

    msg = cMess.mText(cMess.mCode.ERR_MUTUALLY_EXCLUSIVE_FIELDS,
                      cThis.fId, cThis.fEmail);

    dlog.e(msg);

    res.status(cHttp.Unprocessable);
    return res.json({success: false,
                      msg: msg,
                      errMsg: ""})
  } else if ( req.session.user ) {

    // set the changed fields
    if ( req.body[cThis.fName] ) {
      dlog.f('updating name');
      req.session.user[cThis.fName] = req.body[cThis.fName];
    }

    if ( req.body[cThis.fEmail] ) {
      dlog.f('updating email');
      req.session.user[cThis.fEmail] = req.body[cThis.fEmail];
    }
    if ( req.body[cThis.fPassword] ) {
      req.session.user[cThis.fPassword] = req.body[cThis.fPassword];
      dlog.f('updating password');
    }
    if ( req.body[cThis.fUserType_id] ) {
      req.session.user[cThis.fUserType_id] = req.body[cThis.fUserType_id];
      dlog.f('updating uid');
    }

    // update the record in the db
    User.add( req.session.user, (err, doc) => {
      if ( err ) {
        msg = cMess.mText(cMess.mCode.UPD_ERR, cThis.coll);
        dlog.db3(msg);
        dlog.e(err);

        res.status(cHttp.IntServerErr);
        res.json({success: false,
                  msg: msg,
                  errMsg: err})
      } else {
        msg = cMess.mText(cMess.mCode.UPD_SUCC, cThis.coll);
        dlog.db3(msg);
        dlog.db3(log.js(doc));
        res.json({success: true,
                  msg: msg,
                  doc: doc});
      }
    });
  } else {
    dlog.snh ('user not logged in being edited');
    msg = cMess.mText(cMess.mCode.ERR_NOT_LOGGED_IN, 'editing user');

    res.status(cHttp.IntServerErr);
    res.json({success: false,
              msg: msg,
              errMsg: {}})
  }
});

// Profile
//router.get('/profile',passport.authenticate('jwt', {session: false}), (req,res,next) => {
//  res.json({user: req.user});
//});

module.exports = router;