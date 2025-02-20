import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import Cookies from 'js-cookie';
import Login from './screens/Auth/Login';
import Home from './screens/Home';
import Services from './screens/Services';
import Layout from './components/Layout/Layout';


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
        <Route path="/" element={<Layout title={""}><Home /></Layout>} />
        <Route path="/services" element={<Layout title={"Hizmetler"}><Services /></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default function App() {
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      try {
        const token = Cookies.get('token');
        if (token) {
          authCtx.authenticate(token);
        }
      } catch (error) {
        console.error('Token alınırken hata oluştu:', error);
      }
    }

    fetchToken();
  }, [authCtx]);

  return (
    <Router>
      {authCtx.isAuthenticated ? <AppStack /> : <AuthStack />}
    </Router>
  );
}
