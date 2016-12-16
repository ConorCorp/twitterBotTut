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
  //console.log('got a tweet!');
  //Figure out contents of tweet
  var lowerCaseTweet = eventMsg.text.toLowerCase();
  var replyTo = eventMsg.in_reply_to_screen_name;
  var tweeter = eventMsg.user.screen_name;
  var myStatus;

  //necessary or he tweets at all he follows
  if(replyTo === "PupperTweets") {

      //Main Functionality : Checking what to do with the tweet
      //Check for good boy, retweets
    if (lowerCaseTweet.includes('who\'s a good boy') || lowerCaseTweet.includes('who is a good boy') || lowerCaseTweet.includes('whos a good boy')) {
      T.post('statuses/retweet/:id', {id:eventMsg.id_str}, function (err, data, response) {
        //console.log(data);
        //Check if they put some blasphemous words in after I retweeted their good boy tweet (more of an exception)
        var trickery = checkForBlasphemies();
        if(trickery != false) {
          myStatus = "@"+tweeter+" *grrrrr* "+trickery;
          postStatus(myStatus);
        }
      });
    //Check for regular replies
    } else {
      //check for blasphemies
      word = checkForBlasphemies();
      //if word == false there is no blasphemies
      if (word == false) {
        //Most common case, a modulus of borks  
        myStatus = borkStatus();
      } else {
        //there are blasphemies
        myStatus = "@"+tweeter+" heckin "+word+", you're doin me a "+verb()+"!";
      }
      postStatus(myStatus); //need 2 of these because of rts
    }
  }
  //makes a bork status based on a modulus of the username
  function borkStatus() {
    var numBorks = (lowerCaseTweet.length % tweeter.length);
    var borkMod = "bork"; //to make sure we don't get 0 borks
    for (var x = 0; x < numBorks; x++)
    {
      borkMod.concat(" bork");
    }
    var uncutTweet = "@"+tweeter+" "+borkMod;

    if (uncutTweet.length >= 140) {         //if by some chance there are much to much borks
      return uncutTweet.substring(0,139);
    } else {
      return uncutTweet;
    }
  }
  //checks for words doggos hate
  function checkForBlasphemies(){
    var word = false;
    if (lowerCaseTweet.includes('cat') || lowerCaseTweet.includes('kitt')) {
      word = "cats";
    } else if (lowerCaseTweet.includes('vacuum')) {
      word = 'vacuums';
    } else if (lowerCaseTweet.includes('bad boy')) {
      word = "bad boy!";
    }
    return word;
  }
  //post status
  function postStatus(myStatus) {
    T.post('statuses/update', {status:myStatus}, function (err, data, response) {
    //console.log(data);
    });
  }
}

//create a verb for the frightened doggo
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
