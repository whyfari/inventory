let jsLen = ( obj ) => {
  return  Object.entries(obj).length
}
let jsIsEmtpy = ( obj, len ) => {

  let isEmtpy = false;

  if ( len == undefined ) {
    len = Object.entries(obj).length;
  }

  isEmpty = ( len == 0 && obj.constructor === Oject);

  return isEmtpy;
}

module.exports = {
  jsIsEmtpy, jsLen
}