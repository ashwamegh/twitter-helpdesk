const express = require('express');
const router = express.Router();
const Twitter = require('twitter');
require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/twitter', (req, res) => {
  const { key, secret } = req.body;
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: key,
    access_token_secret: secret,
  }); 

  client.get('favorites/list', function(error, tweets, response) {
    if(error) console.log(error);
    console.log(tweets);  // The favorites.
    console.log(response);  // Raw response object.
  });

})

module.exports = router;
