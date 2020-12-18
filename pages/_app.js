import App from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import "../components/toggle.css";
import { RecipeQueryProvider } from "../lib/RecipeQueryContext";
import Head from "next/head";

const theme = {
  colors: {
    primary: "#0070f3",
  },
};

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport" content="width=414,user-scalable=no" />
        </Head>
        <ThemeProvider theme={theme}>
          <RecipeQueryProvider>
            <Component {...pageProps} />
          </RecipeQueryProvider>
        </ThemeProvider>
      </>
    );
  }
}
