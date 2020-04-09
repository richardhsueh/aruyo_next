import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
// import Selector from '../components/selector';
import Toggle from '../components/toggle';
// import RecipeQueryContext from '../context/RecipeQueryContext';

const Container = styled.header`
  margin: 0 auto;
  max-width: 960px;
  padding: 30px 0;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  > div {
    display: flex;
    align-items: center;
    > h1 {
      height: 36px;
      display: inline-block;
      margin: 0 30px 0 0;
      color: var(--textNormal);
      font-size: 36px;
      font-weight: 600;
      letter-spacing: 2px;
      display: flex;
      align-items: center;
      color: var(--textNormal);
    }
  }
  @media screen and (max-width: 767px) {
    padding: 30px 0 10px 0;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    > div {
      flex-direction: column;
      align-items: flex-start;
      > a {
        order: 1;
        margin: 0 0 10px 0;
      }
      [class*="SelectorContainer"] {
        order: 3;
      }
    }
    .react-toggle {
      order: 2;
      position: absolute;
      top: 37px;
      right: 0;
    }
  }
`;

const Header = () => {
  // const { reset } = React.useContext(RecipeQueryContext);
  const [theme, setTheme] = React.useState(null);
  React.useEffect(() => {
    setTheme(window.__theme);
    window.__onThemeChange = () => {
      setTheme(window.__theme);
    };
  }, []);
  return (
    <Container>
      <div>
        <Link href="/">
          <h1><a>Aruyo*</a></h1>
        </Link>
        {/* <Selector /> */}
      </div>
      {theme !== null ? (
        <Toggle
          icons={{
            checked: <img src="/static/moon.png" width="16" height="16" role="presentation" style={{ pointerEvents: 'none' }} />,
            unchecked: <img src="/static/sun.png" width="16" height="16" role="presentation" style={{ pointerEvents: 'none' }} />
          }}
          checked={theme === 'dark'}
          onChange={e => window.__setPreferredTheme(e.target.checked ? 'dark' : 'light')}
        />
      ) : (
        <div style={{ height: '24px' }} />
      )}
    </Container>
  );
};

export default Header;
