import React, {useState} from "react";
import styled from "styled-components";
import BarChart from "./BarChart";
import IOSSwitch from "./IOSSwitch";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;


`;

const AnalysisWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60vw;
  background-color: #cccccc;
  @media(max-width: 500px){
    width: 85vw;
 
  }
`;

const SwitchWrapper = styled.div`
  display: flex;
  width: 50vw;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonHeading = styled.div`
  font-family: aktiv-grotesk;
  color: white;
  font-size: 12px;
`;

const AnalysisHeading = styled.div`
  font-family: aktiv-grotesk;
  color: white;
  font-size: 24px;
  padding: 25px;
`;

const AnalysisHeadingWrapper = styled.div`
  display: flex;
  width: 100vw;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


// flexbox container for the analysis card
const AnalysisContainer = styled.div`
  display: flex;
  flex-flow: row wrap; // shorthand for flex-direction and flex-wrap
  justify-content: center;
`;

// "Sentiment Analysis header for the card"
const AnalysisHeader = styled.header`
  font-size: 40px;
  font-family: Al Tarikh;
  color: #ffffff;
  background-color: #6b6b6b;
  flex: 1 0 100%;
  text-align: center;
`;

// the actual card, which just defines some padding and the background color
const AnalysisCard = styled.div`
  background-color: #15212b;
  height: auto;
  border-radius: 25px;
  padding-left: 5%;
  padding-right: 5%;
`;

// formatting for user info: right now, this is just the user profile name
const AnalysisUserInfo = styled.div`
  color: white;
  font-size: 20px;
  font-family: aktiv-grotesk;
  padding-top: 5%;
`;

// styling for the text from the tweet
const AnalysisTweetText = styled.div`
  font-size: 16px;
  color: white;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 400px;
  padding-top: 5%;
`;

// formatting for meta-data of the tweet. Right now this is just the time the tweet was created
const AnalysisTweetMeta = styled.div`
  font-size: 14px;
  color: #798896;
  padding-top: 5%;
  padding-bottom: 5%;
`;



const Index = (props) => {
  const [documentAnalysis, toggleAnalysis] = useState(true);

  const handleAnalysisChange = (params) => {
    toggleAnalysis(!documentAnalysis);
  };
  return (
    <Root>
      {/* <AnalysisHeadingWrapper>
        <AnalysisHeading> Document </AnalysisHeading>{" "}
      </AnalysisHeadingWrapper> */}
      <SwitchWrapper>
        <ToggleWrapper>
          <ButtonHeading>switch to sentences</ButtonHeading>
          <IOSSwitch
            checked={documentAnalysis}
            onChange={handleAnalysisChange}
          />
        </ToggleWrapper>
      </SwitchWrapper>
      <AnalysisWrapper>
        <BarChart
          labels={["magnitude", "sentiment score"]}
          data={[0.5, 0.7, 0, 1]}
          title={"Document"}
        />
        {/* {here conditionally render document vs sentences analysis} */}
      </AnalysisWrapper>
      </Root>
  );
};

export default Index;