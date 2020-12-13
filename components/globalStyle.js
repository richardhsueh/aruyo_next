import { createGlobalStyle } from "styled-components";

export const ResetStyle = createGlobalStyle`
    html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      vertical-align: baseline;
      box-sizing: border-box;
    }
    address, caption, cite, code, dfn, em, strong, th, var, b {
      font-weight: normal;
      font-style: normal;
    }
    abbr, acronym {
      border: 0;
    }
    article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
      display: block;
    }
    *,
    *::after,
    *::before {
      margin: 0;
      padding: 0;
      box-sizing: inherit;
    }
    html {
      text-size-adjust: 100%;
      box-sizing: border-box;
    }
    body {
        line-height: 1;
    }
    ol, ul {
      list-style: none;
    }
    blockquote, q {
      quotes: none;
    }
    blockquote {
      &:before,   &:after {
        content: '';
        content: none;
      }
    }
    q {
      &:before,   &:after {
        content: '';
        content: none;
      }
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    caption, th {
      text-align: left;
    }
    textarea {
      resize: none;
    }
    a {
      text-decoration: none;
      cursor: pointer;
    }
    button {
      padding: 0;
      border: none;
      background: none;
    }

    a {
      text-decoration: none;
      color: black;
      &:visited,
      &:active {
        color: black;
      }
    }

`;

export const GlobalStyle = createGlobalStyle`
    html , * {
        box-sizing: border-box;
        font-family: 'Inter', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    body {
      --pink: #ffb7b7;
      background-color:  var(--bg);
      transition: color 0.2s ease-out, background 0.2s ease-out;
      position: relative;
      * {
        transition: background 0.2s ease-out;
      }
      &::after {
        position:absolute;
        background: radial-gradient(#c5c5c5 1px, var(--bg) 1px);
        background-size: 20px 20px;
      }
      height: 100vh;
    }

    body.light {
      --background: #fff;
      --primary_text: #000;
      --secondary_text: #B1B2B3;
    }

    body.dark {
      --background: #282c35;
      --primary_text: #fff;
      --secondary_text: rgba(255, 255, 255, 0.7);
    }

    ::selection {
      background: #ffb7b7; /* WebKit/Blink Browsers */
    }
    ::-moz-selection {
      background: #ffb7b7; /* Gecko Browsers */
    }
`;
