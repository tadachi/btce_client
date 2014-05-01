// btce.js
// version 0.0.1.1
// =======
var crypto = require('crypto');
var fs = require('fs');
var http = require('http')
var request = require('request');
var querystring = require('querystring');

var util = require('util');
var events = require('events');

var logger = require('./logger.js');

module.exports = Btce;

util.inherits(Btce, events.EventEmitter);

console.log('btce.js imported successfully.');

createUnixTimeStamp = function() {
    return Math.round((new Date()).getTime() / 1000) ;
}

function Btce() {
	this.btce_api_key = null;
	this.btce_api_secret = null;
    this.balance = null; //JSON object
    this.openOrders = null; //JSON object
    this.serverTime = null; //JSON object
    
	this.logger = null;
}

Btce.prototype.setApiKey = function(btce_api_key) {
	this.btce_api_key = btce_api_key;
}

Btce.prototype.setApiSecret = function(btce_api_secret) {
	this.btce_api_secret = btce_api_secret;
}
/*
 * Accepts getInfo, TransHistory, TradeHistory, ActiveOrder, Trade, CancelOrder
 */
createParams = function (method, params) {
    var unixTimeStamp = createUnixTimeStamp();
    /*
	if (params != null) {
		params['nonce'] = unixTimeStamp;
	}
	*/
    switch (method) {
        case 'getInfo':
            params = {'method' : 'getInfo', 'nonce' : unixTimeStamp }
            return params;        
        case 'TransHistory':
            return {'method' : 'TransHistory', 'nonce' : unixTimeStamp }       
        case 'TradeHistory':
            return {'method' : 'TradeHistory', 'nonce' : unixTimeStamp }
        case 'ActiveOrders':
            return {'method' : 'TradeHistory', 'nonce' : unixTimeStamp }
        case 'Trade':
            params['method'] = 'Trade';
            return params;
        case 'CancelOrder':
            params['method'] = 'CancelOrder';
            return params;
        default:
            message = method + ' is not a valid api method.'; 
            if (self.logger != null) { self.logger.log('Error: ' + error) };           
            console.log(message);
            return null;
    }
}

createSign = function(params, secret) {
    var params_querystring = querystring.stringify(params);
    var hmac = crypto.createHmac('sha512', secret);
    hmac.update(params_querystring);
    var sign = hmac.digest('hex').toString();
    return sign;
}

Btce.prototype.apiCall = function (method, params, callback) {
	var self = this;
    if (!self.btce_api_key || !self.btce_api_secret) {
		error = 'api_key and api_secret are not set.';
        if (self.logger != null) { self.logger.log('Error: ' + error) };
		callback(null);
		return null;
	}
	
    var params = createParams(method, params);
	console.log(params);
    var sign = createSign(params, self.btce_api_secret);
    var _headers = {
        'Content-type': 'application/x-www-form-urlencoded',
        'Key': self.btce_api_key,
        'Sign': sign
    }
    var _url = 'https://btc-e.com/tapi/';
    var _method = 'POST';

    var req = request({ url: _url, method: _method, form: params, headers: _headers }, function(err, res, body) {
		callback(body);
    });
	
}

Btce.prototype.getInfo = function () {
    self = this;
	params = [];
    self.apiCall('getInfo', params, function(result) {
		
        JSONobj = JSON.parse(result);
        console.log(JSONobj);
		self.emit('getInfoEmitted');
    });

    self.once('getInfoEmitted', function() {
		if (JSONobj.success == 1) {
			self.setBalance(JSONobj.return.funds);
			self.setOpenOrders(JSONobj.return.open_orders);
			self.setServerTime(JSONobj.return.server_time);

			message =  JSON.stringify(btceUser.balance) + ' ' + 
				JSON.stringify(btceUser.openOrders) + ' ' + 
				JSON.stringify(btceUser.serverTime); 
			
			console.log(message);
			return JSONobj;
			
			if (self.logger != null) { self.logger.log(message) };
		} else {
			message = JSONobj.error;
			console.log(message);
			return null;
			if (self.logger != null) { self.logger.log(message) };			
		}
    });

}

Btce.prototype.trade = function (pair, type, rate, amount) {
    self = this;
    params = { 
        'pair' : pair,
        'type' : type,
        'rate' : rate,
        'amount' : amount
    }
	
    self.apiCall('Trade', params, function(result) {
        JSONobj = JSON.parse(result);
        self.emit('TradeEmitted');
    });

    self.once('TradeEmitted', function() {
        if (self.logger != null) { self.logger.log(JSON.stringify(JSONobj)) };
        console.log(JSONobj);
    });

}

Btce.prototype.cancelOrder = function (order_id) { 
    self = this;
    params = {
        'order_id' : order_id
    }
    self.apiCall('CancelOrder', params, function(result) {
        JSONobj = JSON.parse(result);
        console.log(JSONobj);
        self.emit('CancelOrderEmitted');
    });

    self.once('CanceOrderEmitted', function() {
        if (self.logger != null) { self.logger.log(JSON.stringify(JSONobj)) };
        console.log(JSONobj);
    });
}

Btce.prototype.activeOrders = function (pair) {
    self=  this;
    params = {
        'pair' : pair
    }

    self.apiCall('ActiveOrders', pair, function(result) {
        JSONobj = JSON.parse(result);
        self.emit('ActiveOrdersEmitted');
    });

    self.once('ActiveOrdersEmitted', function() {
        if (self.logger != null) { self.logger.log(JSON.stringify(JSONObj)) };
        console.log(JSONObj);
    });
}

Btce.prototype.setBalance = function (value) {
    var self = this;
    self.balance = value;
}

Btce.prototype.setOpenOrders = function (value) {
    var self = this;
    self.openOrders = value;
}

Btce.prototype.setServerTime = function (value) {
    var self = this;
    self.serverTime = value;
}