import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from 'styled-components';
import { AppBar } from "./../";

const json = (response) => {
  return response.json()
}

const ProgressContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
`

class HelpDesk extends Component {
  state = {
    tweets: []
  }

  componentDidMount(){
    const self = this;
    fetch(`${process.env.REACT_APP_SERVER}/twitter/tweets`, {
      method: 'post',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
          key: localStorage.getItem('twitterHelpdesk.accessToken'),
          secret: localStorage.getItem('twitterHelpdesk.accessSecret'),
      })
    })
    .then(json)
    .then(function (data) {
      self.setState({ tweets: data})
    })
    .catch(function (error) {
      console.log('Request failed', error);
    });
  }

  render(){
    const { tweets } = this.state;

  return (
     <div>
      <AppBar />
      {
        tweets.length === 0 ?
      <ProgressContainer><CircularProgress style={{margin:12}} /></ProgressContainer>
      : <pre><code>{JSON.stringify(this.state.tweets)}</code></pre>
      }
    </div>
  );
  }
}


export default HelpDesk;