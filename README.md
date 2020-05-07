# inventory
FA inventory app
implemented so far is the creation of userTypes, registering users, logging in and logging out

## setup
need to start up `mongod` before staring up this application
run `./node app.js`


## stuff 
backend runs on localhost:3000

### endpoints
/users
  /all
  /register
  /login
  /logout
  /edit
/userTypes
  /all
  /add

example: http://localhost:3000/users/all

### db schema
dbConsts.js
schema: inv
tables: user, userTypes
