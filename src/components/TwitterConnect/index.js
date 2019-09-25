import React from "react";
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import firebase from 'firebase';
import twitterLogo from "./../../assets/images/twitter-icon.png";

import { AppBar } from "./../";

const TwitterConnectWrap = styled.div`
  margin: 0 auto;
  margin-top: 120px;
  max-width: 290px;
  min-height: 70px;
  text-align: center;
`;
const TwitterConnectButton = styled.div`
  background: #b7b7b7f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  color: #000000e0;
  max-width: 260px;
  min-height: 56px;
  cursor: pointer;
  margin: 0 auto;
`;

const Heading = styled.h3`
  font-weight: 300;
`;

const Image = styled.img`
  width: 15%;
`

const handleTwitterSignIn = (history) => {
  const provider = new firebase.auth.TwitterAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
    const token = result.credential.accessToken;
    const secret = result.credential.secret;
    localStorage.setItem('twitterHelpdesk.accessToken', token);
    localStorage.setItem('twitterHelpdesk.accessSecret', secret);
    history.push('/helpdesk');
  }).catch(function(error) {
    alert("Error connecting Twitter");
  });
}

const TwitterConnect = ({ history }) => (
  <div>
    <AppBar />
    <TwitterConnectWrap>
      <Heading>Connect your Twitter account</Heading>
      <TwitterConnectButton onClick={() => handleTwitterSignIn(history)}>
        <Image src={twitterLogo} alt="Twitter Logo" />
      </TwitterConnectButton>
    </TwitterConnectWrap>
  </div>
);

export default withRouter(TwitterConnect);
