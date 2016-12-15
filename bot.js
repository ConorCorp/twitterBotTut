console.log('Bot is starting!');

var Twit = require('twit');

var T = new Twit({
  consumer_key:         '1H8O2QqiBqxqWFLkp4TVhQnbs',
  consumer_secret:      'PGqCoJRbajGi9AnBkI0cij8f2b5VtudkGJWYiwSV8LpgpU86Ge',
  access_token:         '790430815889096704-90Lvm6lSCr2Jdoqahk8ZwzCpMQGWbbH',
  access_token_secret:  'QEcEqSU39BtBMr4k4739IuppuADve697qRQ1HMqDd7fHW',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

var stream = T.stream('user');

stream.on('tweet', tweetedAt);

function tweetedAt(eventMsg) {
  console.log('got a tweet!');

  var lowerCaseTweet = eventMsg.text.toLowerCase();
  var replyTo = eventMsg.in_reply_to_screen_name;

  if (lowerCaseTweet.includes('who\'s a good boy') || lowerCaseTweet.includes('who is a good boy')) {
    T.post('statuses/retweet/:id', {id:eventMsg.id_str}, function (err, data, response) {
      console.log(data);
    });
  } else if (replyTo === 'PupperTweets') {

    //TODO: This shit worked when I had a console log here
    // then i got a duplicate tweet error
    //now tha shit wont work

    var tweeter = eventMsg.user.screen_name;
    var word;
    if (lowerCaseTweet.includes('cat')) {
      word = "cats";
    } else if (lowerCaseTweet.includes('vacuum')) {
      word = 'vacuums';
    } else if (lowerCaseTweet.includes('bad boy')) {
      word = "bad boy!";
    }

    var myStatus = "\"@"+tweeter+"heckin "+word+" you're doin me a "+verb()+"!\"";
    console.log(myStatus);
    T.post('statuses/update', {status:myStatus}, function (err, data, response) {
    console.log(data);
  });
  }
}

function verb() {
  var chance = Math.random();
  if (chance < 0.34)
  {
    return "frighten";
  } else if (chance > 0.33 && chance < 0.67) {
    return 'concern';
  } else {
    return 'bamboozle';
  }
}
