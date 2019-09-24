const express = require('express');
const router = express.Router();
const Twitter = require('twitter');
require('dotenv').config();



const createTwitterClient = (key, secret) => {
  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: key,
    access_token_secret: secret,
  }); 
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/twitter/tweets', (req, res) => {
  const { key, secret } = req.body;
  const client = createTwitterClient(key, secret);
  
  const params = {
    exclude_replies: false
  }

  client.get('statuses/user_timeline',params, (error, tweets, response) => {
    if(error) console.log(error);
    res.json(tweets);  // The favorites.
  });

})

module.exports = router;
