import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { BrowserRouter } from "react-router";
import { ThemeProvider, CssBaseline } from "@mui/material"; // Importamos el ThemeProvider
import theme from "./theme"; // Importamos el tema que creamos
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>  {/* Aplicamos el tema aquí */}
        <CssBaseline /> {/* Aplica los estilos globales de Material UI */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
