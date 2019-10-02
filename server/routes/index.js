const express = require("express");
const router = express.Router();
const Twitter = require("twitter");
const Twit = require('twit')
require("dotenv").config();
const Pusher = require("pusher");

const createPusherChannelClient = () => {
  return new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: "ap2"
  });
};

const createTwitterClient = (key, secret) => {
  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: key,
    access_token_secret: secret
  });
};

const createTwitClient = (key, secret) => {
  return new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: key,
    access_token_secret: secret
  });
};

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/twitter/tweets", (req, res) => {
  const { key, secret } = req.body;
  const client = createTwitterClient(key, secret);
  const params = {
    exclude_replies: false,
    count: 100
  };
  client.get(
    "statuses/mentions_timeline",
    params,
    (error, mentionedTweets, response) => {
      if (error) console.log(error);
      client.get(
        "statuses/user_timeline",
        { count: 100 },
        (err, tweets, response) => {
          const userTweets = tweets.filter(tweet => tweet.in_reply_to_status_id !== null);
          if (err) console.log(err);
          res.json(userTweets.concat(mentionedTweets));
        }
      );
    }
  );
});

router.post("/twitter/reply", (req, res) => {
  const { key, secret, statusID, status, keywords, username, streamConnected } = req.body;
  const client = createTwitterClient(key, secret);
  const T = createTwitClient(key, secret);
  const channelsClient = createPusherChannelClient();
  const params = {
    in_reply_to_status_id: statusID,
    status
  }
    const stream = T.stream('statuses/filter', {track: keywords})

    stream.on('tweet', (tweet) => {
      console.log(tweet)
      channelsClient.trigger('chat', username, tweet);
    })

  client.post('/statuses/update', params , (error, tweet, response) => {
    if(error) res.sendStatus(500);
    res.json(tweet);
  })
});

module.exports = router;
