import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { keyframes } from '@mui/system';
import CreateTicket from './CreateTicket';
import TicketList from './TicketList';
import TicketDetailModal from './TicketDetailModal';
import { addTicket, setTickets, updateTicket } from '../../app/appSlice';
import { api } from '../../hooks/useAxios';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ─────────────────────────────────────────────
// TicketDashboard — orchestrates list + modals
// ─────────────────────────────────────────────
const TicketDashboard = () => {
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.app?.tickets || []);

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleTicketUpdated = useCallback((updated) => {
    dispatch(updateTicket(updated));
    setSelectedTicket(prev => prev?.id === updated.id ? updated : prev);
  }, [dispatch]);

  // Called when a new ticket is created — immediately open its details and trigger AI
  const handleTicketCreated = useCallback(async (ticket) => {
    dispatch(addTicket(ticket));
    setCreateOpen(false);
    setSelectedTicket(ticket);
    
    setIsGeneratingAi(true);
    try {
      const response = await api.post(`api/v1/tickets/${ticket.id}/ai-response`);
      if (response.data && response.data.ai_response) {
        dispatch(updateTicket(response.data));
        setSelectedTicket(prev => prev?.id === ticket.id ? response.data : prev);
      }
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    } finally {
      setIsGeneratingAi(false);
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('api/v1/tickets/all');
        if (Array.isArray(response.data)) {
          dispatch(setTickets(response.data));
        }
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
      }
    };
    fetchTickets();
  }, [dispatch]);

  return (
    <Box sx={{
      background: 'linear-gradient(145deg, #090e17 0%, #162032 100%)',
      minHeight: '100vh',
      color: '#e2e8f0',
      fontFamily: '"Inter", "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      pt: { xs: 6, md: 10 },
      pb: 8,
    }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Box sx={{
          animation: `${fadeIn} 0.7s cubic-bezier(0.4, 0, 0.2, 1)`,
          mb: 6, p: { xs: 4, md: 5 },
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 4, position: 'relative', overflow: 'hidden'
        }}>
          <Box sx={{ position: 'absolute', top: '-50%', left: '-20%', width: '60%', height: '150%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
              Your Tickets
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', lineHeight: 1.6 }}>
              View and manage all your support requests in one place.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{
              position: 'relative', zIndex: 1,
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              color: '#fff', px: 4, py: 1.8,
              borderRadius: '16px', fontSize: '1.05rem', fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              whiteSpace: 'nowrap',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 30px -10px rgba(99, 102, 241, 0.7)'
              }
            }}
          >
            Create Ticket
          </Button>
        </Box>

        {/* Tickets List */}
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, px: 1, color: '#f1f5f9', animation: `${fadeIn} 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both` }}>
          Recent Tickets
        </Typography>

        <TicketList
          tickets={tickets}
          onViewDetails={setSelectedTicket}
        />

        {/* Create Ticket modal */}
        <CreateTicket
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onTicketCreated={handleTicketCreated}
        />

        {/* View Details modal */}
        <TicketDetailModal
          ticket={selectedTicket}
          open={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          isGeneratingAi={isGeneratingAi}
          onTicketUpdated={handleTicketUpdated}
        />

      </Container>
    </Box>
  );
};

export default TicketDashboard;