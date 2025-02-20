import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./screens/Auth/Login";
import Services from './screens/Services';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './screens/Home';
import Layout from './components/Layout/Layout';

function AuthStack() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/services" element={<Services />} /> */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function AppStack() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);

  return (
    <Router>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

