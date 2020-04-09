/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ResetStyle, GlobalStyle } from './globalStyle';
import Header from './header';
// import Header from './header';

const Wrapper = styled.div`
  max-width: 960px;
  padding: 0 20px;
  @media (min-width: 576px) {
    /* margin: 20px; */
  }

  @media (min-width: 768px) {
    /* margin: 20px; */
    margin: auto;
  }

  @media (min-width: 992px) {
    margin: auto;
  }

  @media (min-width: 1200px) {
    margin: auto;
  }
`;

const Layout = ({ children }) => {

  return (
    <>
      <GlobalStyle />
      <ResetStyle />
      <Wrapper>
        <Header/>
        <main>{children}</main>
      </Wrapper>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
