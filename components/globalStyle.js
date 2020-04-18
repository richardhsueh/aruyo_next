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

h1 {
  margin: 0;
  height: 30px;
  display: inline-block;
}
a {
  text-decoration: none;
  color: black;
  &:visited,
  &:active {
    color: black;
  }
}

main {
  margin-bottom: 100px;
}

`;

export const GlobalStyle = createGlobalStyle`

@font-face {
  font-family: 'IBM Plex Sans Condensed';
  src: url('/fonts/IBMPlexSansCondensed-Regular.woff2'); 
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'IBM Plex Sans Condensed';
  src: url('/fonts/IBMPlexSansCondensed-Bold.woff2'); 
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'IBM Plex Sans Condensed';
  src: url('/fonts/IBMPlexSansCondensed-SemiBold.woff2'); 
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'IBM Plex Sans Condensed';
  src: url('/fonts/IBMPlexSansCondensed-Medium.woff2'); 
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Open Sans';
  src: url('/fonts/OpenSans-Regular.woff2'); 
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

html , * {
    box-sizing: border-box;
    font-family: 'IBM Plex Sans Condensed', sans-serif;
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
}

body.light {
  --bg: #fffaf0;
  --bg-secondary: #F9FAFB;
  --header: var(--pink);
  --textNormal: #3c3c3c;
  --textTitle: #3c3c3c;
  --textPlaceholder: #3c3c3c;
  --textLink: #ffb7b7;
  --hr: hsla(0, 0%, 0%, 0.2);
  --inlineCode-bg: rgba(255, 229, 100, 0.2);
  --inlineCode-text: #1a1a1a;
  --form-shadow: 0 2px 15px 0 rgba(210, 214, 220, 0.5);
}

body.dark {
  -webkit-font-smoothing: antialiased;

  --bg: #282c35;
  --bg-secondary: rgb(54, 60, 72);
  --header: #fffaf0;
  --textNormal: rgba(255, 255, 255, 0.88);
  --textPlaceholder: rgba(255, 255, 255, 0.7);
  --textTitle: #fffaf0;
  --textLink: var(--pink);
  --hr: hsla(0, 0%, 100%, 0.2);
  --inlineCode-bg: rgba(115, 124, 153, 0.2);
  --inlineCode-text: #e6e6e6;
  --form-shadow: 0 2px 15px 0 rgba(26, 26, 27, 0.637);
}

::selection {
  background: #ffb7b7; /* WebKit/Blink Browsers */
}
::-moz-selection {
  background: #ffb7b7; /* Gecko Browsers */
}
`;
