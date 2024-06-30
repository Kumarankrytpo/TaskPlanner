import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import AuthCode from './AuthCode';
import DashBoard from './dashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import { GlobalProvider } from './utils/GlobalContext';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/authcode" element={<AuthCode />} exact />
              <Route path="/dashboard" element={<DashBoard />} />
            </Route>
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;
