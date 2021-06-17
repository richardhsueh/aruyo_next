import React from "react";
import styled from "styled-components";
import Mousetrap from "mousetrap";
import RecipeQueryContext from "../../lib/RecipeQueryContext";
import Router from "next/router";

const Container = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  .pop-up {
    width: 90%;
    max-width: 600px;
    margin: 7rem auto;
    background: #fff;
  }
  .search-bar {
    background: #fff;
    font-size: 1rem;
    transition: all 0.1s linear;
    padding: 12px 0 12px 0;
    position: relative;
    font-weight: normal;
    text-align: left;
    box-shadow: none !important;
    color: #b1b2b3;
    width: 100%;
    padding-left: 0rem;
    display: flex;
    align-items: center;
    > span {
      font-size: 1rem;
      margin-left: 1rem;
      position: absolute;
    }
  }
  .header__search-icon {
    transform: translateY(-1px) rotate(-45deg) scale(1.5);
    vertical-align: bottom;
  }
  form {
    width: 100%;
    background-color: transparent;
  }
  input {
    /* width: 100%; */
    background-color: transparent;
    font-size: 1rem;
    line-height: 1.5rem;
    transition: all 0.1s linear;
    padding-right: 20px;
    position: relative;
    border-radius: 0 !important;
    padding-left: 40px;
    border: none;
    outline-offset: -2px;
    &:focus,
    &:active {
      outline: none;
      box-shadow: none;
    }
  }

  @media screen and (min-width: 961px) {
    .pop-up {
      width: 100%;
    }
  }
`;

function SearchComponent(props) {
  const [open, setOpen] = React.useState(false);
  const {
    type,
    changeType,
    inputHandler,
    query,
    isOpen,
    toggle,
  } = React.useContext(RecipeQueryContext);

  React.useEffect(() => {
    Mousetrap.bind("esc", function () {
      const { pathname } = Router;
      if (isOpen) {
        inputHandler("");
      }
      if (isOpen && query === "") {
        toggle(false);
      }
      if (!isOpen && query === "" && pathname !== "/") {
        Router.push("/");
      }
    });
    Mousetrap.bind("command+f", function (e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        // internet explorer
        e.returnValue = false;
      }
      toggle(true);
      document.getElementById("search").focus();
      Router.push("/");
    });

    Mousetrap.bind("enter", function (e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      toggle(false);
    });

    return () => {
      Mousetrap.unbind("esc");
      Mousetrap.unbind("command+f");
      Mousetrap.unbind("enter");
    };
  }, [isOpen, query, inputHandler, toggle]);

  return isOpen ? (
    <Container
      id="container"
      onClick={(e) => {
        if (e.target.id === "container") {
          toggle(false);
        }
      }}
    >
      <div id="search-window" className="pop-up">
        <div className="search-bar">
          <span className="header__search-icon ">⚲</span>
          <input
            autoFocus
            id="search"
            autoComplete="off"
            type="text"
            className="search-bar__input mousetrap"
            placeholder="e.g. pasta, egg ..."
            onChange={(e) => inputHandler(e.target.value)}
            value={query}
          />
        </div>
      </div>
    </Container>
  ) : null;
}

export default SearchComponent;
