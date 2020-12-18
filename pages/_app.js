import App from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import "../components/toggle.css";
import { RecipeQueryProvider } from "../lib/RecipeQueryContext";

const theme = {
  colors: {
    primary: "#0070f3",
  },
};

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <RecipeQueryProvider>
          <Component {...pageProps} />
        </RecipeQueryProvider>
      </ThemeProvider>
    );
  }
}
