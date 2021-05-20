// Load express module and initialising the object
var express = require('express');
var app = express();
var router = express.Router();

// Load request module
var request = require('request');

// environment variables. Setting the environment as development, which will be used to fetch the development config values.
process.env.NODE_ENV = 'development';

// Load request module
var lodash = require('lodash');

// loading config values
const config = require('../config/config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = lodash.merge(defaultConfig, environmentConfig);

// as a best practice all global variables should be referenced via global syntax and their names should always begin with g
global.gConfig = finalConfig;


// this function routes the HTTP GET Requests to the provide URL path which is being specified with the specified access token and access keys
app.get(global.gConfig.app_uri, function(req, res) {
  // Reading the tweet id passed in the request URL
	var tweet_id = req.params['id'];
        console.log("consumer key  : "+global.gConfig.oauth_consumer_key);
	// setting the http URL, authorization details
    var options = {
        'method': 'GET',
        'url': global.gConfig.url_twitter + tweet_id + '?tweet.fields=attachments,author_id,created_at,entities,geo,id,in_reply_to_user_id,lang,possibly_sensitive,referenced_tweets,source,text,withheld',
        'headers': {
            'Authorization': 'OAuth oauth_consumer_key='+global.gConfig.oauth_consumer_key+',oauth_token='+global.gConfig.oauth_token+',oauth_signature_method='+global.gConfig.oauth_signature_method+',oauth_timestamp="1621533888",oauth_nonce='+global.gConfig.oauth_nonce+',oauth_version='+global.gConfig.oauth_version+',oauth_signature='+global.gConfig.oauth_signature
  }
    };
    request(options, function(error, response) {
        if (error) throw new Error(error);
        // logs the resonse message body to command prompt console
		console.log(response.body);
		// logs the resonse message body to command prompt console
		res.end(response.body);
    });
});

// setting the application to listen on port configured in the config file
var server = app.listen(global.gConfig.node_port, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Fetch Tweet Details app listening at http://%s:%s", host, port)

})


module.exports = router;
