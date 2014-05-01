/*
 * Testing
 *
 */

var btce    = require("./btce.js");
var logger = require('./logger.js');

//var btce_api_key = 'PKJ6PJQA-ELBJ9IHT-3P1197HP-9GGKJ7LV-72U5DFVA'   
//var btce_api_secret = '0cfe0b4fd53a62d077ec5cf5322cc3c74410fbd0b30aea3c7f8af7cda0cbf303'
var btce_api_key = '4GZYCKYA-YKZB2R02-ME3C1UXX-90GQHE3W-I0ZLUS29';
var btce_api_secret = '54945039c2428ca7a118bb6ed3003cf32abec2af2025eb5d07a291bd3392f411';

var btceUser = new btce();
var logger1 = new logger('./btce_test.log');
btceUser.logger = logger1;
btceUser.logger.start();

btceUser.setApiKey(btce_api_key);
btceUser.setApiSecret(btce_api_secret);


btceUser.apiCall('getInfo', [], function(result) {
	console.log(result);
	//JSONobj = JSON.parse(result);
    //console.log(JSONobj);
});



/*
 * getInfo
 */

//btceUser.getInfo();

/*
 * Trade
 */ 

//btceUser.trade('ltc_usd', 'sell', 200, 0.1)

/*
 *
 */

//btceUser.activeOrders('');

/*
 * CancelOrder
 */ 

//btceUser.cancelOrder(158110199);

/* logger Test
var l = new logger('log1.txt');
l.start();
l.log('test')
*/