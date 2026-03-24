import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Container, Typography, Button, Grid, Card, CardContent, Grow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import { keyframes } from '@mui/system';
import CreateTicket from './CreateTicket';
import { addTicket, setTickets } from '../../app/appSlice';
import { api } from '../../hooks/useAxios';

// subtle entry animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TicketDashboard = () => {
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.app?.tickets || []);
  
  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleViewDetails = (ticket) => setSelectedTicket(ticket);
  const handleCloseDetails = () => setSelectedTicket(null);

  const handleTicketCreated = (ticket) => {
    dispatch(addTicket(ticket));
  };

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
        {/* Header Section */}
        <Box sx={{ 
          animation: `${fadeIn} 0.7s cubic-bezier(0.4, 0, 0.2, 1)`,
          mb: 6,
          p: { xs: 4, md: 5 },
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 4,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle gradient background accent */}
          <Box sx={{
            position: 'absolute',
            top: '-50%',
            left: '-20%',
            width: '60%',
            height: '150%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%)',
            zIndex: 0,
            pointerEvents: 'none'
          }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 800, 
              mb: 2,
              background: 'linear-gradient(135deg, #fff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}>
              Your Tickets
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', lineHeight: 1.6 }}>
              View and manage all your support requests in one place.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{
              position: 'relative',
              zIndex: 1,
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              color: '#fff',
              px: 4,
              py: 1.8,
              borderRadius: '16px',
              fontSize: '1.05rem',
              fontWeight: 600,
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
        <Typography variant="h5" sx={{ 
          mb: 4, 
          fontWeight: 700, 
          px: 1, 
          color: '#f1f5f9', 
          animation: `${fadeIn} 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both` 
        }}>
          Recent Tickets
        </Typography>

        <Grid container spacing={3}>
          {tickets.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: '#94a3b8' }}>
                  No tickets found. Create a new one to get started.
                </Typography>
              </Box>
            </Grid>
          ) : (
            tickets.map((ticket, index) => (
              <Grid item xs={12} key={ticket.id}>
                <Grow in={true} timeout={800 + (index * 200)}>
                  <Card sx={{
                    background: 'rgba(30, 41, 59, 0.4)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(148, 163, 184, 0.08)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: { xs: 2, md: 3 },
                    py: { xs: 2, md: 2.5 },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
                      borderColor: 'rgba(59, 130, 246, 0.3)',
                      background: 'rgba(30, 41, 59, 0.6)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: '12px', 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        mr: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#60a5fa'
                      }}>
                        <ConfirmationNumberOutlinedIcon />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
                          {ticket.title}
                        </Typography>
                        <Chip 
                          label={ticket.status || 'CREATED'} 
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(59, 130, 246, 0.1)', 
                            color: '#60a5fa', 
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            fontWeight: 600,
                            mt: 0.5
                          }} 
                        />
                      </Box>
                    </Box>
                    <Button variant="outlined" 
                      onClick={() => handleViewDetails(ticket)}
                      sx={{ 
                      color: '#94a3b8', 
                      borderColor: 'rgba(148, 163, 184, 0.2)',
                      textTransform: 'none',
                      borderRadius: '10px',
                      display: { xs: 'none', sm: 'block' },
                      '&:hover': {
                        borderColor: '#60a5fa',
                        color: '#60a5fa',
                        background: 'rgba(59, 130, 246, 0.05)'
                      }
                    }}>
                      View Details
                    </Button>
                  </Card>
                </Grow>
              </Grid>
            ))
          )}
        </Grid>

        {/* Create Ticket Modal extracted to its own component */}
        <CreateTicket 
          open={open} 
          onClose={handleClose} 
          onTicketCreated={handleTicketCreated} 
        />

        {/* View Details Modal */}
        <Dialog 
          open={!!selectedTicket} 
          onClose={handleCloseDetails}
          PaperProps={{
            sx: {
              background: '#1e293b',
              color: '#f1f5f9',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minWidth: { xs: '90%', sm: '500px' },
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', pb: 2, pt: 3, px: 4, fontWeight: 700, fontSize: '1.5rem' }}>
            Ticket Details
          </DialogTitle>
          <DialogContent sx={{ pt: '24px !important', px: 4 }}>
            {selectedTicket && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Title</Typography>
                  <Typography variant="body1" sx={{ color: '#f1f5f9', fontWeight: 600, mt: 0.5 }}>{selectedTicket.title}</Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip 
                      label={selectedTicket.status} 
                      size="small" 
                      sx={{ bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontWeight: 600 }} 
                    />
                  </Box>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Assigned To</Typography>
                  <Typography variant="body1" sx={{ color: '#f1f5f9', mt: 0.5 }}>{selectedTicket.assigned_to || 'Unassigned'}</Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', mt: 0.5, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{selectedTicket.description}</Typography>
                </Box>
                
                {selectedTicket.ai_response && (
                  <>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                    <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.05)', p: 2, borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                      <Typography variant="caption" sx={{ color: '#34d399', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>AI Response</Typography>
                      <Typography variant="body2" sx={{ color: '#e2e8f0', mt: 1, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{selectedTicket.ai_response}</Typography>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, px: 4, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Button onClick={handleCloseDetails} sx={{ color: '#94a3b8', textTransform: 'none', fontWeight: 600 }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default TicketDashboard;