import { Routes, Route } from "react-router-dom";
import { Welcome } from "./components/Welcome/Welcome";
import AuthPage from "./screens/AuthPage";
import { LoginPage } from "./screens/LogInPage";
import { SignUpPage } from "./screens/SignUpPage";
import { Toaster } from "react-hot-toast";
import { MapPage } from "./screens/MapPage";
import { Chatbot } from "./components/ChatBot/ChatBot";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home-map" element={<MapPage />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </>
  );
}

export default App;
