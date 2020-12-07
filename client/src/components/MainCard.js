import React from "react";
import styled from "styled-components";
import BrandBackground from "../imgs/BrandBackground.png";
import Brand from "../icons/Brand";
import { Formik } from "formik";
import SearchIcon from "../imgs/SearchIcon.svg";
import * as Yup from "yup";

const Root = styled.div`
  background-color: #515151;
  height: 550px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

//fix backgrond position on smaller screens
const Card = styled.div`
  background-color: #3d3838;
  height: 400px;
  width: 60vw;
  background-image: url(${BrandBackground});
  background-repeat: no-repeat;
  background-position: 70% 50%;
  background-size: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-radius: 25px;
  padding: 35px;
  z-index: 1;
`;

const Heading = styled.div`
  color: white;
  font-size: 50px;
  font-family: aktiv-grotesk;
  width: 300px;

  @media (min-width: 1000px) {
    margin-left: 50px;
  }
`;

const SearchBar = styled.input`
  padding: 25px;
  padding-left: 60px;
  font-family: aktiv-grotesk;
  height: 65px;
  width: 50vw;
  z-index: 2;
  border-radius: 25px;
  outline: none;
  background-image: url(${SearchIcon});
  background-repeat: no-repeat;
  background-position: 15px 17px;
  border: none;
  font-size: 20.0952px;
  line-height: 26px;
  /* identical to box height */

  color: #434343;
`;

const Spacing = styled.div`
  padding: 15px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 16px;
  font-family: aktiv-grotesk;
  padding: 5px;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 75px;
`;


const MainCard = (props) => {
  return (
    <Root>
      <Card>
        <Heading>Analyze Your Tweets. </Heading>
      </Card>
      <Spacing />
      <Formik
        initialValues={{ tweet: "" }}
        validationSchema={Yup.object({
          tweet: Yup.string()
            .matches(
              /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
              "Enter a Tweet URL"
            )
            .required("Enter a Tweet URL"),
        })}
        onSubmit={(values, actions) => {
          console.log(values.tweet);
          props.setTweetSearched(true)
        }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <SearchWrapper>
              <SearchBar
                type="text"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.tweet}
                name="tweet"
                placeholder="enter a tweet url to begin"
              />
              {props.errors.tweet && props.touched.tweet ? (
                <ErrorMessage>{props.errors.tweet}</ErrorMessage>
              ) : null}
            </SearchWrapper>
            {/* <button type="submit">Submit</button> */}
          </form>
        )}
      </Formik>
    </Root>
  );
};

export default MainCard;