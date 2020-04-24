const Twit = require('twit');
const config = require('./config');
const fetch = require("node-fetch");

var T = new Twit(config);

// tweet once a day
setInterval(tweetRandomTrivia, 1000*60*60*24);// once a day

function tweetRandomTrivia() {
fetch('http://jservice.io/api/random')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // pull out the relevant data from the JSON
      response.json().then(function(data) {
        const category = data[0].category.title.toUpperCase();
        const question = data[0].question;
        const answer = data[0].answer;

        // construct the tweet content from the JSON data
        var tweetContent = "Jeopardy Clue of the Day!\nCategory: " + category + "\n\nClue: " + question + "\n\n.\n.\n.\n.\n.\n.\n.\n\n" + "Answer: " + answer;

        if(tweetContent.length <= 280) {
            // if the tweet isnt too long, tweet it
            postTweet(tweetContent);
        } else {
            // if it's too long, just do another request and tweet that (this shouldn't happen too often)
            fetch('http://jservice.io/api/random');
        }
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

// Request functions
function postTweet(content) {
    T.post('statuses/update', { status: content }, function(err, data, response) {
        if(err){
            console.log(err);
        } else {
            console.log("Tweet posted successfully.");
        }
    })
}

function searchFor(term, resultCount) {
    T.get('search/tweets', {q: term, count: resultCount}, function(err, data, response) {
        if(err){
            console.log(err);
        } else {
            var tweets = data.statuses;
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
                console.log();
            }
        }
    })
}
  