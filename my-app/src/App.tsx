import { Routes, Route } from 'react-router-dom';
import { Welcome }from "./components/Welcome/Welcome";
import AuthPage from './screens/AuthPage';
import SignUpPage from './screens/SignUpPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
}

export default App;
