import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Auth from "./screens/Auth";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#45a5f5",
      contrastText: "#fff",
      light: "#55b5ff",
      dark: "#3b9beb",
    },
    secondary: {
      main: "#fff",
      contrastText: "#3b9beb",
      light: "#55b5ff",
      dark: "#f5f5ff",
    },
  },
  typography: {
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

function App() {
  return (
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Auth />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
