import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/bebas-neue";
import "@fontsource/bungee";
import theme from "./theme.ts";
import { AuthProvider } from "./hooks/useAuth.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
