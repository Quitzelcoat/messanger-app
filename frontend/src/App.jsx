import useAuth from './auth/AuthProvider';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/SignupPage/Signup';
import Login from './pages/LoginPage/Login';
import HomePage from './pages/HomePage/HomePage';
import Chat from './pages/ChatPage/Chat';
import AllUsers from './components/AllUsers';
import Profile from './components/Profile';

function App() {
  const { token, setToken, handleLogout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <HomePage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/chat"
          element={
            token ? (
              <Chat onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/all-users"
          element={
            token ? (
              <AllUsers token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/signup"
          element={token ? <Navigate to="/" replace /> : <Signup />}
        />

        <Route
          path="/login"
          element={
            token ? <Navigate to="/" replace /> : <Login setToken={setToken} />
          }
        />

        <Route
          path="*"
          element={<Navigate to={token ? '/' : '/login'} replace />}
        />

        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
