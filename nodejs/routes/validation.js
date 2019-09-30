const { body } = require('express-validator/check')

let validate = (method, model) => {

  console.log('in here')
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


module.exports = { validate }