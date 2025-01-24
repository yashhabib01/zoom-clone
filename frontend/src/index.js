import "./setup.ts";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import store from "./store/index";
import "./index.css";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <ColorModeScript
      initialColorMode={theme.config.initialColorMode}
      useSystemColorMode={false}
    />
    <Provider store={store}>
      <App />
    </Provider>
  </ChakraProvider>
);
