//used to retrieve awesome link data from Redis

var redis = require('redis');
var client = redis.createClient();

exports.index = function(req, res) {
  //pull results from redis sorted set ordered by score, highest score first
  client.zrevrangebyscore('awesome', '+inf', '-inf', 'withscores', function(error, results){
    var responseString = "";
    var topLinkString = "";
    var topLinkNumTweets;
    var mostTracking = 20; //will display 9, since the scores are part of the results
	var limit;

	//check amount of links in the results to display no more than amount assigned in mostTracking variable
	if (results.length > mostTracking){
		limit = mostTracking
	}
	else {
		limit = results.length;
	}

	//pull top link to send via topAwesomeLink
    topLinkString += "<a href='" + results[0] + "'>" + results[0] + "</a>"; 

  //pull score from top link to send via topAwesomeLinkNumTweets
    topLinkNumTweets = results[1];

	//pull remaining links and attach to responseString
    for (var i = 2 ; i < limit ; i++) {
		  if (i%2 == 0){
			 responseString += "<a href='" + results[i] + "'>" + results[i] + "'</a>";
		   }
      
		  else if (i%2 == 1){
        if (results[i] > 1){
			     responseString += " (Tweeted <font color='#000'>" + results[i] + "<font color='#3cb3b5'> times!) <br /><br />";
         }
        else if (results[i] = 1){
          responseString += " (Tweeted just once.) <br />";
        }
		  }
     
    }

	  //send responseString to awesomeLinks, topLinkString to topAwesomeLink, and topLinkNumTweets to be displayed via awesome.ejs
      res.render('word/awesome', {awesomeLinks:responseString, topAwesomeLink:topLinkString, topAwesomeLinkNumTweets:topLinkNumTweets});
  });

};
