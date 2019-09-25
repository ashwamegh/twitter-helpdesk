import React, { Component, Fragment, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Pusher from "pusher-js";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import {
  ThemeProvider,
  ChatList,
  ChatListItem,
  Avatar,
  Column,
  Row,
  Title,
  Subtitle,
  Message,
  MessageList,
  MessageGroup,
  MessageText,
  TextComposer,
  IconButton,
  AddIcon,
  TextInput,
  SendButton
} from "@livechat/ui-kit";
import styled from "styled-components";
import { AppBar } from "./../";

const json = response => {
  return response.json();
};

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

const ChatContainer = styled.div`
  height: calc(100vh - 64px);
  width: 100%;
`;

const Image = styled.img`
  max-width: 400px;
`;
const ScrollableGrid = styled(Grid)`
  height: calc(100vh - 64px);
  overflow-y: scroll;
`;

class HelpDesk extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tweets: [],
      tweetThread: [],
      message: "",
      threadID: "",
    };

    this.postThreadReply = this.postThreadReply.bind(this);
    this.updateNewStatus = this.updateNewStatus.bind(this);
  }

  componentDidMount() {
    const self = this;
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "ap2",
      forceTLS: true
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", socketData => {
      this.setState({ tweets: [socketData, ...this.state.tweets] }, () => {
        this.fetchTweetThread(this.state.threadID);
      });
    });

    fetch(`${process.env.REACT_APP_SERVER}/twitter/tweets`, {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        key: localStorage.getItem("twitterHelpdesk.accessToken"),
        secret: localStorage.getItem("twitterHelpdesk.accessSecret")
      })
    })
      .then(json)
      .then(function(data) {
        self.setState({ tweets: data });
      })
      .catch(function(error) {
        console.log("Request failed", error);
      });
  }

  fetchTweetThread = tweetID => {
    const { tweets } = this.state;
    const tweetThread = tweets
      .filter(
        tweet =>
          tweet.id_str === tweetID ||
          tweet.in_reply_to_status_id_str === tweetID
      )
      .reverse();
    this.setState({ tweetThread, threadID: tweetID });
  };

  postThreadReply() {
    const { message, tweetThread } = this.state;

    fetch(`${process.env.REACT_APP_SERVER}/twitter/reply`, {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        key: localStorage.getItem("twitterHelpdesk.accessToken"),
        secret: localStorage.getItem("twitterHelpdesk.accessSecret"),
        status: `@${tweetThread[0].user.screen_name} ${message}`,
        statusID: tweetThread[0].id_str
      })
    })
      .then(json)
      .then(function(data) {
        console.log("tweeted");
      })
      .catch(function(error) {
        console.log("Request failed", error);
      });
  }

  updateNewStatus(event) {
    this.setState({ message: event.target.value });
  }

  render() {
    const { tweets, tweetThread, threadID } = this.state;

    return (
      <ThemeProvider>
        <AppBar />
        {tweets.length === 0 ? (
          <ProgressContainer>
            <CircularProgress style={{ margin: 12 }} />
          </ProgressContainer>
        ) : (
          <ChatContainer>
            <Grid container spacing={0}>
              <ScrollableGrid item xs={4}>
                {Chatlist(tweets, this.fetchTweetThread, threadID)}
              </ScrollableGrid>
              <ScrollableGrid
                item
                xs={8}
                style={{ borderLeft: "1px solid #8080803d" }}
              >
                {Messagelist(tweetThread)}
                <TextComposer
                  style={{ minHeight: 150 }}
                  onChange={this.updateNewStatus}
                  onSend={this.postThreadReply}
                >
                  <Row align="center">
                    <IconButton fit>
                      <AddIcon />
                    </IconButton>
                    <TextInput />
                    <SendButton fit />
                  </Row>
                </TextComposer>
              </ScrollableGrid>
            </Grid>
          </ChatContainer>
        )}
      </ThemeProvider>
    );
  }
}


const Chatlist = (tweets, fetchTweetThread, threadID) => {
  return (
    <ChatList>
      {tweets
        .filter(tweet => tweet.in_reply_to_status_id === null)
        .map(tweet => {
          return (
            <ChatListItem
              active={threadID === tweet.id_str}
              key={tweet.id}
              onClick={() => fetchTweetThread(tweet.id_str)}
            >
              <Avatar
                letter={tweet.user.name.split("")[0]}
                imgUrl={tweet.user.profile_image_url_https}
              />
              <Column>
                <Row justify>
                  <Title ellipsis>{tweet.user.name.split(" ")[0]}</Title>
                  <Subtitle nowrap>
                    {moment(new Date(tweet.created_at)).format("LT")}
                  </Subtitle>
                </Row>
                <Subtitle ellipsis>{tweet.text}</Subtitle>
              </Column>
            </ChatListItem>
          );
        })}
    </ChatList>
  );
};

const Messagelist = tweetThread => {
  return (
    <MessageList active>
      {tweetThread.map(thread => (
        <MessageGroup
          avatar={thread.user.profile_image_url_https}
          onlyFirstWithMeta
          key={thread.id}
        >
          <Message
            authorName={thread.user.name}
            date={`${moment(new Date(thread.created_at)).format(
              "ll"
            )} at ${moment(new Date(thread.created_at)).format("LT")}`}
          >
            <MessageText>{thread.text}</MessageText>
          </Message>
        </MessageGroup>
      ))}
    </MessageList>
  );
};

export default HelpDesk;
