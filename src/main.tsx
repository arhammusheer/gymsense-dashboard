import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/bebas-neue";
import "@fontsource/bungee";
import theme from "./theme.ts";
import { AuthProvider } from "./hooks/useAuth.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>
);
