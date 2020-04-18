import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [
          ...React.Children.toArray(initialProps.styles),
          sheet.getStyleElement(),
        ],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preload"
            href="/fonts/IBMPlexSansCondensed-Bold.woff2"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/IBMPlexSansCondensed-Medium.woff2"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/IBMPlexSansCondensed-Regular.woff2"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/IBMPlexSansCondensed-SemiBold.woff2"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/OpenSans-Regular.woff2"
            as="font"
            crossOrigin=""
          />
          <style
            dangerouslySetInnerHTML={{
              __html: ` @font-face {
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
                        }`,
            }}
          />
        </Head>
        <body className="light">
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function() {
                window.__onThemeChange = function() {};
                function setTheme(newTheme) {
                  window.__theme = newTheme;
                  preferredTheme = newTheme;
                  document.body.className = newTheme;
                  window.__onThemeChange(newTheme);
                }
                var preferredTheme;
                try {
                  preferredTheme = localStorage.getItem('theme');
                } catch (err) { }
                window.__setPreferredTheme = function(newTheme) {
                  setTheme(newTheme);
                  try {
                    localStorage.setItem('theme', newTheme);
                  } catch (err) {}
                }
                var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
                darkQuery.addListener(function(e) {
                  window.__setPreferredTheme(e.matches ? 'dark' : 'light')
                });
                setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'));
              })();
            `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
