import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";

import Auth from "./screens/Auth";
import About from "./screens/About";
import Main from "./screens/Main";
import Group from "./screens/Group";
import Chat from "./screens/Chat";
import Call from "./screens/Call";
import Sponsors from "./screens/Sponsors";
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";
import CallList from "./screens/CallList"
import SettingsChat from "./screens/SettingsChat"
import InProgress from "./screens/InProgress";
import FAQ from "./screens/FAQ";
import NewChat from './screens/NewChat';
import NewGroup from "./screens/NewGroup";


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
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/main" element={<Main />} />
          <Route path="/group" element={<Group />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/call" element={<Call />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/call_list" element={<CallList />} />
          <Route path="/settings_chat" element={<SettingsChat />} />
          <Route path="/contacts" element={<InProgress />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support_list" element={<InProgress />} />
          <Route path="/new_chat" element={<NewChat />} />
          <Route path="/new_group" element={<NewGroup />} />
        </Routes>
    </Router>
  );
}

export default App;
