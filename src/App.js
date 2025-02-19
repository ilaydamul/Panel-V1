import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./screens/Auth/Login";
import Services from './screens/Services';

function AuthStack() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function AppStack() {
  return (
    <Routes>
      <Route path="/" element={<Services/>} />
      <Route path="/services" element={<Services/>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  const isAuthenticated = true;

  return (
    <Router>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </Router>
  );
}

export default App;
