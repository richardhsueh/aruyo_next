import React from 'react';
import Downshift from 'downshift';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import Mousetrap from 'mousetrap';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import CloseIcon from '@material-ui/icons/Close';
import RecipeQueryContext, { options } from '../lib/RecipeQueryContext';
import Router from 'next/router'

const SelectorContainer = styled.div`
  display: inline-flex;
  position: relative;
  width: 290px;
  top: 0;
  height: 35px;
`;

const TypeSelectorContainer = styled(animated.div)`
  position: absolute;
  border-right: 2px solid var(--textNormal);
  &.isOpen {
    overflow: hidden;
  }
`;

const TypeSelector = styled.div`
  display: inline-flex;
  width: 250px;
  position: relative;

  @media screen and (max-width: 425px) {
    width: 250px;
  }

  > label {
    display: inline-flex;
    width: auto;
    height: 35px;
    padding: 5px 10px;
    border: 2px solid var(--textNormal);
    border-right: none;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 20px;
    line-height: 20px;
    color: var(--textNormal);
  }
  .typeSelector__btn {
    background: transparent;
    border: none;
    display: inline-flex;
    width: auto;
    flex: auto;
    height: 35px;
    padding: 0px 10px;
    border: 2px solid var(--textNormal);
    border-right: none;
    justify-content: space-between;
    align-items: center;
    text-transform: uppercase;
    color: var(--textNormal);
    font-weight: bold;
    font-size: 20px;
    line-height: 20px;
    cursor: pointer;
    &:focus {
      outline: none;
    }
    &:active {
      background-color: lightgrey;
      border-right: 2px solid var(--textNormal);
    }
    svg {
      font-size: 20px;
      margin: 3px;
      right: 5px;
    }
  }
  .typeSelector__options {
    position: absolute;
    right: 0;
    width: 73%;
    top: 35px;
    .downshift-dropdown {
      width: 100%;
      position: absolute;
      right: 0;
      z-index: 1000;
      .dropdown-item {
        height: 35px;
        display: flex;
        font-size: 20px;
        align-items: center;
        cursor: pointer;
        padding: 3px 10px;
        border: 2px solid var(--textNormal);
        color: var(--textNormal);
        background: var(--bg) !important;
        border-top: none;
        text-transform: uppercase;
        text-align: left;
      }
    }
  }
`;

const SearchBtn = styled(animated.button)`
  cursor: pointer;
  right: 0;
  position: absolute;
  width: 40px;
  height: 35px;
  background: var(--bg);
  border: none;
  padding: 0 4px 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:focus {
    outline: none;
  }
  svg {
    color: var(--textNormal);
  }
`;

const SearchBar = styled(animated.div)`
  overflow: hidden;
  height: 35px;
  position: absolute;
  background: var(--bg);
  right: 0px;
  width: 300px;
  input {
    font-size: 20px;
    height: 35px;
    width: 200px;
    border-radius: 0px;
    border: 2px solid var(--textNormal);
    background: var(--bg);
    color: var(--textNormal);
    margin: 0 0 0 10px;
    padding: 5px 10px;
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: var(--textPlaceholder);
    }
  }
  .closeBtn {
    cursor: pointer;
    position: absolute;
    width: 40px;
    height: 35px;
    padding: 0 6px 0 4px;
    background: var(--bg);
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
    &:focus {
      outline: none;
    }
    svg {
      color: var(--textNormal);
    }
  }
`;

const Selector = props => {
  // const location = useLocation();
  const { type, changeType, inputHandler, query, isOpen, toggle } = React.useContext(RecipeQueryContext);

  const typeSelectorProps = useSpring({ to: { width: isOpen ? '0px' : '250px' } });
  const searchIconProps = useSpring({ to: { left: isOpen ? '0px' : '250px' } });
  const searchBarProps = useSpring({ to: { width: isOpen ? '250px' : '0px' } });

  const onChange = (selectedOption = 'all') => {
    if (selectedOption === null) {
      selectedOption = 'all';
    }
    Router.push('/')
    changeType(selectedOption);
  };

  React.useEffect(() => {
    Mousetrap.bind('esc', function() {
      const {pathname} = Router;
      if (isOpen) {
        inputHandler('');
      }
      if (isOpen && query === '') {
        toggle(false);
      }
      if (!isOpen && query === '' && pathname !== '/') {
        Router.push('/')
      }
    });
    Mousetrap.bind('command+f', function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        // internet explorer
        e.returnValue = false;
      }
      toggle(true);
      document.getElementById('searchBar').focus();
    });

    return () => {
      Mousetrap.unbind('esc');
      Mousetrap.unbind('command+f');
    };
  }, [isOpen, query, inputHandler, toggle]);

  return (
    <SelectorContainer>
      <TypeSelectorContainer className={`${isOpen ? 'isOpen' : ''}`} style={typeSelectorProps}>
        <Downshift onChange={onChange} selectedItem={type} id="type-selector">
          {({
            isOpen,
            getToggleButtonProps,
            getItemProps,
            highlightedIndex,
            selectedItem: dsSelectedItem,
            getLabelProps,
            getRootProps
          }) => (
            <TypeSelector {...getRootProps()}>
              <label htmlFor="typeSelector" {...getLabelProps()}>
                Type
              </label>
              <button id="typeSelector" className="typeSelector__btn" {...getToggleButtonProps()}>
                {type}
                {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </button>
              <div className="typeSelector__options">
                {isOpen ? (
                  <div className="downshift-dropdown">
                    {options.map((item, index) => (
                      <div
                        className="dropdown-item"
                        {...getItemProps({ key: index, index, item })}
                        style={{
                          backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                          fontWeight: dsSelectedItem === item ? 'bold' : 'normal'
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </TypeSelector>
          )}
        </Downshift>
      </TypeSelectorContainer>
      <SearchBtn
        style={searchIconProps}
        disabled={isOpen}
        onClick={() => {
          toggle();
          document.getElementById('searchBar').focus();
        }}
      >
        <SearchIcon />
      </SearchBtn>
      <SearchBar style={searchBarProps}>
        <input
          className="mousetrap"
          id="searchBar"
          type="text"
          placeholder="e.g. pasta, egg ..."
          onChange={e => inputHandler(e.target.value)}
          value={query}
        />
        <button
          style={searchIconProps}
          className="closeBtn"
          onClick={() => {
            toggle();
            inputHandler('');
          }}
        >
          <CloseIcon />
        </button>
      </SearchBar>
    </SelectorContainer>
  );
};

export default Selector;
