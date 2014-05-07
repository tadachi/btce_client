/*
 * Testing
 *
 */

var btce    = require("./btce.js");
//var logger = require('./logger.js');

var btce_api_key = '';
var btce_api_secret = ''

var btceUser = new btce();
var logger1 = ''
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