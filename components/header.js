import Link from "next/link";
import React from "react";
import styled from "styled-components";
import RecipeQueryContext from "../lib/RecipeQueryContext";
import Router from "next/router";
import { useTransition, config } from "react-spring";

const SearchBtn = styled.button`
  order: 3;
  margin-left: 20px;
  font-weight: normal;
  font-size: 20px;
  line-height: 24px;
  position: relative;
  width: 30px;
  padding: 0 5px;
  span {
    font-weight: normal;
    font-size: 20px;
    line-height: 24px;
    color: var(--primary_text);
    transform: translate(-50%, -50%) rotate(-45deg) scale(1.5);
    position: absolute;
    top: 50%;
    left: 50%;
  }
`;

const Container = styled.nav`
  grid-area: auto / 1 / auto / end;
  display: grid;
  row-gap: 40px;
  margin-top: 2rem;
  h1 {
    font-weight: normal;
    font-size: 20px;
    line-height: 24px;
    color: var(--primary_text);
    padding: 3px 0;
    order: 2;
  }
  .home {
    color: var(--secondary_text);
  }
  h2 {
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
    color: var(--primary_text);
  }
  ul {
    li {
      color: var(--secondary_text);
      font-size: 14px;
      line-height: 17px;
      margin: 8px 0;

      &.active {
        color: var(--primary_text);
      }
    }
  }
  .selector ul li {
    cursor: pointer;
    &.active {
      color: var(--primary_text);
    }
  }
  .head_ctrl {
    display: flex;
    justify-content: left;
  }
  .nav_ctrl {
    display: grid;
    row-gap: 40px;
    position: absolute;
    top: 67px;
    left: -100%;
    transition: left 0.2s ease, background 0.2s ease-out;
    /* width: 260px; */
    background: var(--background);
    box-shadow: 3px 3px 40px rgba(0, 0, 0, 0.15);
    border-radius: 0px 4px 4px 0px;
    padding: 15px 15px 15px 30px;
    grid-auto-rows: min-content;
    z-index: 100;

    &.active {
      left: 0;
    }
  }

  @media screen and (min-width: 961px) {
    grid-area: auto / 1 / auto / 4;
    position: absolute;
    top: 0;
    .nav_ctrl {
      display: grid;
      row-gap: 40px;
      position: initial;
      top: initial;
      left: initial;
      height: auto;
      box-shadow: none;
      padding: 0;
    }
    ul {
      li {
        margin: 6px 0;
      }
    }
  }
`;

const BurgerMenuButton = styled.div`
  @keyframes slideInLeft {
    0% {
      transform: translate3d(-250px, 0, 0);
      visibility: visible;
    }

    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slideOutLeft {
    0% {
      transform: translate3d(0, 0, 0);
    }

    100% {
      transform: translate3d(-250px, 0, 0);
      visibility: hidden;
    }
  }
  display: inline-block;
  /* background: var(--background); */
  cursor: pointer;
  height: 30px;
  padding: 5px 3px;
  position: relative;
  transition: all 0.2s ease-out;
  user-select: none;
  width: 30px;
  z-index: 12;
  order: 1;
  margin-right: 10px;

  .b-bun {
    background: var(--primary_text);
    position: relative;
    transition: all 0.4s ease;

    &--top {
      height: 2px;
      top: 0;
      width: 25px;
    }

    &--mid {
      height: 2px;
      top: 8px;
      width: 25px;
    }

    &--bottom {
      height: 2px;
      top: 16px;
      width: 25px;
    }
  }

  &.open {
    .b-bun--top {
      background: var(--primary_text);
      top: 9px;
      transform: rotate(45deg);
    }

    .b-bun--mid {
      opacity: 0;
    }

    .b-bun--bottom {
      background: var(--primary_text);
      top: 5px;
      transform: rotate(-45deg);
    }
  }

  @media screen and (min-width: 961px) {
    display: none;
  }
`;

const Header = () => {
  const { type, changeType, recipes, reset, toggle, isOpen } = React.useContext(
    RecipeQueryContext
  );
  const [theme, setTheme] = React.useState(null);
  const [show, setShow] = React.useState(false);
  const transitions = useTransition(null, null, {
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    from: { opacity: 0 },
    config: config.stiff,
  });

  React.useEffect(() => {
    setTheme(window.__theme);
    window.__onThemeChange = () => {
      setTheme(window.__theme);
    };
  }, []);

  const toggleSideMenu = () => {
    setShow(!show);
  };

  const onChange = (selectedOption = "all") => () => {
    if (selectedOption === null) {
      selectedOption = "all";
    }
    Router.push("/");
    toggleSideMenu();
    changeType(selectedOption);
  };

  return (
    <Container>
      <div className="head_ctrl">
        <h1>
          <Link href="/" passHref>
            <a onClick={reset} className="home">
              Aruyo
            </a>
          </Link>{" "}
          /{" "}
          <Link href="/" onClick={reset}>
            Recipe
          </Link>
        </h1>
        <SearchBtn
          onClick={() => {
            toggle(true);
          }}
        >
          <span className="head_search-icon ">⚲</span>
        </SearchBtn>
        <BurgerMenuButton
          className={`b-menu ${show ? "open" : ""}`}
          onClick={toggleSideMenu}
        >
          <div className="b-bun b-bun--top"></div>
          <div className="b-bun b-bun--mid"></div>
          <div className="b-bun b-bun--bottom"></div>
        </BurgerMenuButton>
      </div>
      <div className={`nav_ctrl ${show ? "active" : ""}`}>
        <div className="selector">
          <h2>Type</h2>
          <ul>
            <li
              className={type === "all" ? "active" : ""}
              onClick={onChange("all")}
            >
              All
            </li>
            <li
              className={type === "sweet" ? "active" : ""}
              onClick={onChange("sweet")}
            >
              Sweet
            </li>
            <li
              className={type === "savoury" ? "active" : ""}
              onClick={onChange("savoury")}
            >
              Savoury
            </li>
          </ul>
        </div>
        <div>
          <h2>Recipe</h2>
          {transitions.map(({ item, key, props }) => (
            <ul style={props} key={key}>
              {recipes.map((o) => (
                <li key={o.slug}>
                  <Link href={`/recipe/${o.slug}`} passHref key={o.slug}>
                    <a
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      {o.recipe_name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Header;
