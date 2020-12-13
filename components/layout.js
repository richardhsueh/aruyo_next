import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ResetStyle, GlobalStyle } from "./globalStyle";
import Header from "./header";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(12, [col-start] 1fr);
  margin: 0 2em 0 2em;
  column-gap: 16px;

  main {
    grid-column-start: 4;
    grid-column-end: 12;
    max-width: 56em;
    margin-top: 5em;
    margin-bottom: 10em;
  }
  @media screen and (min-width: 768px) {
    column-gap: 32px;
  }
  @media screen and (min-width: 961px) {
    column-gap: 64px;
  }
`;

const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <ResetStyle />
      <Wrapper>
        <Header />
        <main>{children}</main>
      </Wrapper>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
