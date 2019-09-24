import React from "react";
import styled from "styled-components";
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
  max-width: 290px;
  min-height: 70px;
  cursor: pointer;
`;

const Heading = styled.h3`
  font-weight: 300;
`;

const Image = styled.img`
  width: 15%;
`

const TwitterConnect = () => (
  <div>
    <AppBar />
    <TwitterConnectWrap>
      <Heading>Connect your Twitter account</Heading>
      <TwitterConnectButton>
        <Image src={twitterLogo} alt="Twitter Logo" />
      </TwitterConnectButton>
    </TwitterConnectWrap>
  </div>
);

export default TwitterConnect;
