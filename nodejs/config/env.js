process.env.PORT_NJS_INVENTORY = 3000;
process.env.HOST_NJS_INVENTORY = '172.23.59.158';

// set debugging levels using env variables ... not working
//process.env.DEBUG= '*-R.userTypes:db, -nodemon*, -express*';
//process.env.DEBUG = '';

// set debugging levels using enable/disable
var debug = require('debug');

var disableExpress = '-*express*, ';
var enableExpress = '*express*, ';
var disableNodemon = '-*nodemon*,';

var always = '*ERROR*, *WARNING*, *SNH*, *TODO_FA*, *WHY*, *INIT*, ';
var alwaysExp = always +  enableExpress;

var def = alwaysExp +  '*log*, ';
var defNoExp = always +  '*log*, ';

var moreLevels = def +  '*db, ' + '*http';
var moreLevelsNoExp = defNoExp +  '*db, ' + '*http';

var customLevel = '-*user:*';


// disable (almost) all
//debug.enable( always);
//debug.enable( mostly);

// enable all
//debug.enable('*');

// others
//debug.enable( moreLevels);
//debug.enable( moreLevelsNoExp);
//debug.enable( customLevel);

// default
//debug.enable(def);


//current
debug.enable('* -*exp*');
