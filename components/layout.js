import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ResetStyle, GlobalStyle } from "./globalStyle";
import Header from "./header";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(12, [col-start] 1fr);
  margin: 0 1.3em 0 1.3em;
  column-gap: 16px;

  main {
    grid-column-start: 1;
    grid-column-end: end;
    margin-top: 2em;
    margin-bottom: 10em;
  }

  @media screen and (min-width: 767px) {
    column-gap: 32px;
    margin: 0 30px 0 30px;
  }
  @media screen and (min-width: 961px) {
    column-gap: 64px;
    main {
      grid-column-start: 4;
      grid-column-end: end;
      max-width: 56em;
      margin-top: 6em;
      margin-bottom: 10em;
    }
  }
  @media (min-width: 1441px) {
    main {
      grid-column-start: 4;
    }
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
