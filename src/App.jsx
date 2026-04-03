import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { setupInterceptors, api } from "./hooks/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo, clearUserInfo, setKnowledgeBases } from "./app/appSlice";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./components/Home";
import LandingPage from "./components/LandingPage";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import KnowledgeBaseDashboard from "./components/KnowledgeBase/KnowledgeBaseDashboard";
import TicketDashboard from "./components/Ticket/TicketDashboard";
import OpenTickets from "./components/Ticket/OpenTickets";

function App() {
  const { getToken } = useAuth();
  const { isSignedIn, isLoaded, user } = useUser();
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.app.userInfo?.role === 'ticket_admin');

  // Decode JWT payload without a library (claims are public, not secret-bearing)
  const decodeJwtPayload = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        // Fetch token to extract org role from o.rol
        getToken().then((token) => {
          const claims = token ? decodeJwtPayload(token) : null;
          const role = claims?.o?.rol || null;
          console.log("role: ",role)
          dispatch(setUserInfo({
            id: user.id,
            firstName: user.firstName,
            fullName: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
            role, // e.g. 'ticket_admin'
          }));
        });
      } else {
        dispatch(clearUserInfo());
      }
    }
  }, [isLoaded, isSignedIn, user, dispatch, getToken]);

  useEffect(() => {
    // Setup the interceptor to attach Clerk Bearer token
    const interceptorId = setupInterceptors(getToken);

    // Cleanup interceptor on unmount to prevent memory leaks or duplicate interceptors
    return () => {
      api.interceptors.request.eject(interceptorId);
    };
  }, [getToken]);

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      const fetchKnowledgeBases = async () => {
        try {
          const response = await api.get('api/v1/kb/all');
          if (Array.isArray(response.data)) {
            dispatch(setKnowledgeBases(response.data));
          }
        } catch (err) {
          console.error('Failed to fetch knowledge bases globally:', err);
        }
      };
      fetchKnowledgeBases();
    }
  }, [isSignedIn, isLoaded, dispatch]);

  if (!isLoaded) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        background: '#1e1e1e',
      }}>
        <Loader />
      </Box>
    );
  }


  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: '#1e1e1e',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <ToastContainer theme="dark" position="bottom-right" />
      <Navbar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Route for logged out users */}
          <Route 
            path="/" 
            element={!isSignedIn ? <LandingPage /> : <Navigate to="/home" replace />} 
          />
          
          {/* Route for logged in users */}
          <Route 
            path="/home" 
            element={isSignedIn ? <Home /> : <Navigate to="/" replace />} 
          />

          {/* Knowledge Base routes */}
          <Route 
            path="/knowledge-bases" 
            element={isSignedIn ? <KnowledgeBaseDashboard /> : <Navigate to="/" replace />} 
          />


          {/* Ticket routes */}
          <Route 
            path="/tickets" 
            element={isSignedIn && !isAdmin ? <TicketDashboard /> : <Navigate to={isSignedIn ? '/home' : '/'} replace />} 
          />

          {/* Open Tickets — admin only */}
          <Route 
            path="/open-tickets" 
            element={isSignedIn && isAdmin ? <OpenTickets /> : <Navigate to={isSignedIn ? '/home' : '/'} replace />} 
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to={isSignedIn ? '/home' : '/'} replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;

