import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { setupInterceptors, api } from "./hooks/useAxios";
import { useDispatch } from "react-redux";
import { setUserInfo, clearUserInfo, setKnowledgeBases } from "./app/appSlice";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./components/Home";
import LandingPage from "./components/LandingPage";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import KnowledgeBaseDashboard from "./components/KnowledgeBase/KnowledgeBaseDashboard";
import TicketDashboard from "./components/Ticket/TicketDashboard";

function App() {
  const { getToken } = useAuth();
  const { isSignedIn, isLoaded, user } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        dispatch(setUserInfo({
          id: user.id,
          firstName: user.firstName,
          fullName: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        }));
      } else {
        dispatch(clearUserInfo());
      }
    }
  }, [isLoaded, isSignedIn, user, dispatch]);

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
            element={isSignedIn ? <TicketDashboard /> : <Navigate to="/" replace />} 
          />

          
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to={isSignedIn ? "/home" : "/"} replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;

