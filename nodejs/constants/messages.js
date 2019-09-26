
const cMessCode = {

  LOOKUP_SUCCESS :          1, 
  LOOKUP_FAIL :             2,
  LOOKUP_ERROR:             3,
  DELETE_SUCCESS :          4,
  DELETE_FAIL :             5,
  DELETE_ERROR:             6,
  ADD_SUCCESS :             7,
  ADD_FAIL:                 8,
  COMPARE_PASSWORD_ERR:     9,
  INCORRECT_CREDENTIALS:    10,
  CORRECT_CREDENTIALS:      11,
}

module.exports = cMessCode;


var getMessage = function ( messageCode) {
  var mes = '';
  switch(messageCode) {
    case cMessCode.LOOKUP_SUCCESS:
      mes = 'Look up sucessfull on table \'' + arguments[1] + '\'';
      if ( arguments[2] != '' ) {
        mes += ' criteria: \'' + arguments[2] + '\''; 
      }
      break;
    case cMessCode.LOOKUP_FAIL:
      mes = 'Look up fail on table \'' + arguments[1] + '\''; 
      if ( arguments[2] != '' ) {
        mes += ' criteria: \'' + arguments[2] + '\''; 
      }
      break;
    case cMessCode.ADD_SUCCESS:
      mes = 'Record add sucessful on table \'' + arguments[1] + '\''; 
      break;
    case cMessCode.ADD_FAIL:
      mes = 'Record add fail on table \'' + arguments[1] + '\''; 
      break;
    case cMessCode.COMPARE_PASSWORD_ERR:
      mes = 'Bcrypt password compare error\'' + arguments[1] + '\'';
      break;
    case cMessCode.INCORRECT_CREDENTIALS:
      mes = 'Incorrect \'' + arguments[1] + '\'';
      break;
    case cMessCode.CORRECT_CREDENTIALS:
      mes = 'Correct credentials'
      break;
    default:
      mes = 'Default message'; 
  }

  return mes;
}

module.exports = {
  cMessCode, getMessage
}