import React from "react";
import styled, { keyframes } from "styled-components";
import { FiSun, FiMoon } from "react-icons/fi";

const spin = keyframes`
  0% {
    transform: rotate(-45deg);
  }
  100% {
    transform: rotate(135deg);
  }
`;

const spin2 = keyframes`
  0% {
    transform: rotate(135deg);
  }
  100% {
    transform: rotate(315deg);
  }
`;

const iconSpin = keyframes`
  0% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(225deg);
  }
`;

const iconSpin2 = keyframes`
  0% {
    transform: rotate(225deg);
  }
  100% {
    transform: rotate(405deg);
  }
`;

const DarkModeSelector = styled.label`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border: 1px solid
    ${(props) => (props.mode === "light" ? "var(--primary_text)" : "white")};
  overflow: hidden;
  box-sizing: border-box;
  transition: 200ms all ease-out;
  background: ${(props) => (props.mode === "light" ? "white" : "#282c35")};
  cursor: pointer;
  position: fixed;
  top: -50px;
  right: -50px;
  z-index: 100;

  animation: ${(props) => (props.mode === "light" ? spin2 : spin)} 600ms
    forwards;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    transform: translateY(-50%);
    > * {
      animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
      animation: ${(props) => (props.mode === "light" ? iconSpin2 : iconSpin)}
        800ms forwards;
    }
  }
  #sun {
    width: 40%;
    height: 50%;
    position: absolute;
  }
  #moon {
    left: 60%;
    width: 40%;
    height: 50%;
    position: absolute;
  }
`;

export default function App() {
  const [theme, setTheme] = React.useState(null);
  React.useEffect(() => {
    setTheme(window.__theme);
    window.__onThemeChange = () => {
      setTheme(window.__theme);
    };
  }, []);

  return theme !== null ? (
    <DarkModeSelector mode={theme} htmlFor="darkmodeselector">
      <input
        id="darkmodeselector"
        type="checkbox"
        aria-label="Switch between Dark and Light mode"
        checked={theme === "dark"}
        onChange={(e) =>
          window.__setPreferredTheme(e.target.checked ? "dark" : "light")
        }
      />
      <div id="sun">
        <FiSun size="1.5em" color="#282c35" />
      </div>
      <div id="moon">
        <FiMoon size="1.5em" color="white" />
      </div>
    </DarkModeSelector>
  ) : (
    <div />
  );
}
