import { createTheme } from "@mui/material/styles";

// Crea y personaliza el tema
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Color principal (puedes cambiarlo)
    },
    secondary: {
      main: "#dc004e", // Color secundario (puedes cambiarlo)
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif", // Establece la fuente global
    h1: {
      fontSize: "2.5rem", // Tamaño de fuente personalizado para los encabezados
    },
    h2: {
      fontSize: "2rem",
    },
    // Puedes agregar más personalizaciones de tipografía aquí
  },
});

export default theme;
