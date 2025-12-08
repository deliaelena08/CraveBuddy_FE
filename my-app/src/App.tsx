import { Routes, Route } from "react-router-dom";
import { Welcome } from "./components/Welcome/Welcome";
import AuthPage from "./screens/AuthPage";
import { LoginPage } from "./screens/LogInPage";
import { SignUpPage } from "./screens/SignUpPage";
import { Chatbot } from "./components/ChatBot/ChatBot";
import { MenuPage } from "./screens/MenuItemPage/MenuItemPage";
import { MapPage } from "./screens/MapPage";
import { SettingsPage } from "./screens/SettingsPage/SettingsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home-map" element={<MapPage />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/menu/:bakeryId" element={<MenuPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </>
  );
}

export default App;
