# inventory
FA inventory app <br>
implemented so far is the creation of userTypes, registering users, logging in and logging out

## setup
need to start up mongodb deamon server `mongod` before staring up this application <br>
run `mongod` # needs to stay up, run in background or diff terminal or w.e
run `./node app.js`


## stuff 
backend runs on localhost:3000
on browser go to `https://localhost:3000'

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

example on browser go to: `http://localhost:3000/users/all` <br>

### db schema
dbConsts.js <br>
schema: inv <br>
tables: user, userTypes <br>
