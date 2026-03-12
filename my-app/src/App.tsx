import { Routes, Route } from "react-router-dom";
import { Welcome } from "./components/Welcome/Welcome";
import AuthPage from "./screens/AuthPage";
import { LoginPage } from "./screens/LogInPage";
import { SignUpPage } from "./screens/SignUpPage";
import { Chatbot } from "./components/ChatBot/ChatBot";
import { MenuPage } from "./screens/MenuItemPage/MenuItemPage";
import { MapPage } from "./screens/MapPage";
import { SettingsPage } from "./screens/SettingsPage/SettingsPage";
import { UnauthorizedPage } from "./screens/UnauthorizedPage";
import { ProtectedRoute } from "./components/Routes/ProtectedRoute";
import { UserListPage } from "./screens/UserListPage/UserListPage";
import { BakeryListPage } from "./screens/BakeryListPage/BakeryListPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route
          element={<ProtectedRoute allowedRoles={["USER", "OWNER", "ADMIN"]} />}
        >
          <Route path="/home-map" element={<MapPage />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/menu/:bakeryId" element={<MenuPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["OWNER", "ADMIN"]} />}>
          <Route path="/my-bakeries" element={<BakeryListPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/bakeries" element={<BakeryListPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
