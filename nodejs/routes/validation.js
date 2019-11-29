var logNameSpace = '';
var dlog = require('../lib/debuggers')(logNameSpace);
var log = require('../lib/log');
const cHttp= require('../constants/consts').cHttp;
var cDb= require('../constants/dbConsts');
var cMess = require('../constants/messages.js');
const User = require('../models/user');

//TODO_REMOVE
const { body } = require('express-validator/check')

let validate = (method, model) => {

  switch (method) {
    case 'add': {
      return [
        body('name', 'name does not exists').exists(),
        body('password', 'password does not exists').exists(),
        body('email', 'Invalid email').exists().isEmail(),
        //body('phone').optional().isInt(),
        //body('status').optional().isIn(['enabled', 'disabled'])
        ]
    }
  }
}

let logReq = ( req, res ) => {
dlog.fb(logReq);
let today= new Date().toLocaleString();
dlog.l(today);
res.append('DateTime', today);
dlog.http(req.method + ' ' + req.originalUrl);
dlog.http2('headers: ' + log.js(req.headers));
dlog.http2('body: ' + log.js(req.body));
dlog.l('session id:',req.session.id,log.js(req.session));

dlog.fe(logReq);
}

let setupSessionUser = (req, res) => {
dlog.fb(setupSessionUser);
  if (req.session && req.session.userId) {
    dlog.f(req.session);
    dlog.l('user with id: \''+ req.session.userId+ '\' on session. Look it up');
    User.getById( req.session.userId , (err, user) => {
      if (user) {
        dlog.l('user with id: \''+ req.session.userId+ '\' on session looked up, name: \''+ user[cDb.user.fName]+ '\'');
        //req.user = user;
        //delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        //res.locals.user = user;
      } else {
        dlog.l('user with id: \''+ req.session.userId+ '\' on session not found');
      }
    });
  } else {
    dlog.l('No req session or session user id');
  }
dlog.fe(setupSessionUser);
}

let checkUserLevel = ( level, userTypeId ) => {
dlog.fb(checkUserLevel);
  // check user type ... allow special permissions for ADMINs?
  if ( level == 0 ) {
    if ( userTypeId == '5d926fbbc53df815bca5e9de' ) {
      return true;
    }
  } else {
    return true;
  }
dlog.fe(checkUserLevel);
}

let requireLogin = ( req, res, next ) => {
dlog.fb(requireLogin);
  //  TODO change
  let level = 1;
  let method = 'uhhh';

  if ( req.session.user ) {
    if ( checkUserLevel(level, req.session.user[cDb.user.fUserType_id]) ) {
      dlog.f('user level okay, next ...');
      next();
    } else {
      msg = cMess.mText(cMess.mCode.ERR_USER_LEVEL,
                        cDb.user[cDb.user.fUserType_id],
                        method);
      dlog.e(msg);
      res.status(cHttp.UnAuth);
      return res.json({success: false,
                        msg: msg,
                        errMsg: ""});
    }
  } else {

    msg = cMess.mText(cMess.mCode.ERR_NOT_LOGGED_IN, method);
    dlog.e(msg);
    res.status(cHttp.UnAuth);
    return res.json({success: false,
                      msg: msg,
                      errMsg: ""});
  }
dlog.fe(requireLogin);
}

let requireNoLogin = ( req, res, next ) => {
dlog.fb(requireNoLogin);
  if ( req.session.user ) {
      dlog.f('require no login !ok', cMess.mCode.ERR_LOGGED_IN);
      msg = cMess.mText(cMess.mCode.ERR_LOGGED_IN,
                        req.session.user[cDb.user.fEmail]);

      dlog.e(msg);
      res.status(cHttp.BadReq);
      return res.json({success: false,
                        msg: msg,
                        errMsg: ""});
  } else {

      dlog.f('require no login ok');
  }
  next();
dlog.fe(requireNoLogin);
}

module.exports = { validate, logReq, setupSessionUser, checkUserLevel, requireLogin, requireNoLogin }