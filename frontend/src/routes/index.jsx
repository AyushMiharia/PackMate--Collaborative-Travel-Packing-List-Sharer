// src/App.js
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home/Home';
import Dashboard from '../pages/Dashboard/Dashboard';
import CreateTrip from '../pages/CreateTrip/CreateTrip';
import TripDetail from '../pages/TripDetail/TripDetail';
import Community from '../pages/Community/Community';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Profile from '../pages/Profile/Profile';
import PageAccessWrapper from '../components/pageAccessWrapper/index';
import useAuth from '../hooks/useAuth';

import '../styles/global.css';
import Navbar from '../components/Navbar/Navbar';
import CommunityTripDetail from '../pages/CommunityTripDetails/CommunityTripDetails';

const RoutesProvider = () => {
  const { user, isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <>
      <Navbar
        user={user}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Routes>
        <Route path="/community" element={<Community />} />
        <Route
          path="/community/:id"
          element={
            <CommunityTripDetail userEmail={user?.email} isAuthenticated={isAuthenticated} />
          }
        />
        <Route element={<PageAccessWrapper />}>
          <Route
            path="/dashboard"
            element={<Dashboard user={user} isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/create-trip"
            element={isAuthenticated ? <CreateTrip /> : <Navigate to="/login" replace />}
          />

          <Route path="/trip/:id" element={<TripDetail userEmail={user?.email} />} />

          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <Profile user={user} isAuthenticated={isAuthenticated} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />
      </Routes>
    </>
  );
};

export default RoutesProvider;
