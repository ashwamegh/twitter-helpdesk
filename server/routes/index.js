const express = require('express');
const router = express.Router();
const Twitter = require('twitter');
require('dotenv').config();
const Pusher = require('pusher');

const createPusherChannelClient = () => {
  return new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: 'ap2',
    encrypted: true
  });
}

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
    exclude_replies: false,
    count: 50
  }
    client.get('statuses/user_timeline',params, (error, tweets, response) => {
      if(error) console.log(error);
      res.json(tweets);
    })
  })

  router.post('/twitter/reply',  (req, res) => {
    const { key, secret, statusID, status } = req.body;
    const client = createTwitterClient(key, secret);
    const channelsClient = createPusherChannelClient();
    const params = {
      in_reply_to_status_id: statusID,
      status
    }

    client.post('/statuses/update', params , (error, tweet, response) => {
      channelsClient.trigger('chat', 'message', tweet);
      if(error) res.sendStatus(500);
      res.json(tweet);
    })
  })

module.exports = router;
