# inventory
FA inventory app <br>
implemented so far is the creation of userTypes, registering users, logging in and logging out

## setup
need to start up `mongod` before staring up this application <br>
run `./node app.js`


## stuff 
backend runs on localhost:3000

### endpoints
/users <br>
  /all <br>
  /register <br>
  /login <br>
  /logout <br>
  /edit <br>
 <br>
/userTypes <br>
  /all <br>
  /add <br>

example: http://localhost:3000/users/all <br>

### db schema
dbConsts.js <br>
schema: inv <br>
tables: user, userTypes <br>
