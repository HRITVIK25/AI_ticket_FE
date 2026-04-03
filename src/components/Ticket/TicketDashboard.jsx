import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Container, Typography, Button, Grid, Card, Grow, Chip, Dialog, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import { keyframes } from '@mui/system';
import CreateTicket from './CreateTicket';
import { addTicket, setTickets, updateTicket } from '../../app/appSlice';
import { api } from '../../hooks/useAxios';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const POLL_INTERVAL_MS = 4000;

// ─────────────────────────────────────────────
// TicketDetailModal — polls ai-response until done
// ─────────────────────────────────────────────
const TicketDetailModal = ({ ticket: initialTicket, onClose, onTicketUpdated }) => {
  const [ticket, setTicket] = useState(initialTicket);
  const pollingRef = useRef(null);
  const messagesEndRef = useRef(null);

  const needsPolling = useCallback((t) => !t?.ai_response, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const fetchAiResponse = useCallback(async (ticketId) => {
    try {
      const res = await api.get(`api/v1/tickets/${ticketId}/ai-response`);
      const updated = res.data;
      if (updated?.ai_response) {
        setTicket(updated);
        onTicketUpdated(updated);
        stopPolling();
      }
    } catch (err) {
      // Silent — keep polling
      console.warn('AI response poll error:', err);
    }
  }, [onTicketUpdated, stopPolling]);

  // Sync when parent ticket changes (e.g. different ticket opened)
  useEffect(() => {
    setTicket(initialTicket);
  }, [initialTicket]);

  // Start / stop polling
  const ticketId = ticket?.id;
  const hasAiResponse = !!ticket?.ai_response;

  useEffect(() => {
    if (!ticketId) return;
    stopPolling();

    if (!hasAiResponse) {
      // Immediate first call
      fetchAiResponse(ticketId);
      pollingRef.current = setInterval(() => fetchAiResponse(ticketId), POLL_INTERVAL_MS);
    }

    return stopPolling;
  }, [ticketId, hasAiResponse, fetchAiResponse, stopPolling]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  if (!ticket) return null;

  const isSystem = (role) => role === 'system' || role === 'AI' || role === 'ai';
  const isCustomer = (role) => role === 'customer';

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100%' }}>

      {/* LEFT PANEL */}
      <Box sx={{
        width: { xs: '100%', md: '36%' },
        borderRight: { md: '1px solid rgba(255, 255, 255, 0.08)' },
        borderBottom: { xs: '1px solid rgba(255, 255, 255, 0.08)', md: 'none' },
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        overflowY: 'auto',
        background: 'rgba(15, 23, 42, 0.8)',
      }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Ticket
          </Typography>
          <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, mt: 0.5, lineHeight: 1.3 }}>
            {ticket.title}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />

        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Status &amp; Tag
          </Typography>
          <Box sx={{ mt: 0.75, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={ticket.status || 'CREATED'}
              size="small"
              sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 700, border: '1px solid rgba(59,130,246,0.3)' }}
            />
            {ticket.tag && (
              <Chip
                label={ticket.tag}
                size="small"
                sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700, border: '1px solid rgba(16,185,129,0.3)' }}
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />

        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Assigned To
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            {ticket.assigned_to || 'Unassigned'}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />

        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Initial Description
          </Typography>
          <Typography variant="body2" sx={{ color: '#cbd5e1', mt: 0.75, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {ticket.description}
          </Typography>
        </Box>

        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Button
            onClick={onClose}
            fullWidth
            variant="outlined"
            sx={{
              color: '#94a3b8',
              borderColor: 'rgba(148, 163, 184, 0.2)',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              '&:hover': { borderColor: '#60a5fa', color: '#60a5fa', background: 'rgba(59,130,246,0.05)' }
            }}
          >
            Close
          </Button>
        </Box>
      </Box>

      {/* RIGHT PANEL — Chat */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.06)', background: 'rgba(30, 41, 59, 0.5)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
            Conversation
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {ticket.messages?.length || 0} message{ticket.messages?.length !== 1 ? 's' : ''}
            {needsPolling(ticket) && (
              <Box component="span" sx={{ ml: 1.5, color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{
                  width: 6, height: 6, borderRadius: '50%', background: '#10b981',
                  animation: 'dot-pulse 1.2s ease-in-out infinite',
                  '@keyframes dot-pulse': { '0%,100%': { opacity: 0.3 }, '50%': { opacity: 1 } }
                }} />
                AI responding…
              </Box>
            )}
          </Typography>
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(!ticket.messages || ticket.messages.length === 0) && !needsPolling(ticket) && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="body2" sx={{ color: '#475569' }}>No messages yet.</Typography>
            </Box>
          )}

          {ticket.messages?.map((msg, idx) => {
            const isAI = isSystem(msg.senderRole);
            const isCust = isCustomer(msg.senderRole);
            const initials = msg.senderRole?.slice(0, 2).toUpperCase() || '??';
            const time = msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '';

            return (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, flexDirection: isCust ? 'row-reverse' : 'row' }}>
                {/* Avatar */}
                <Box sx={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 700,
                  background: isAI ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  color: '#fff',
                }}>
                  {isAI ? 'AI' : initials}
                </Box>
                {/* Bubble */}
                <Box sx={{ maxWidth: '70%' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.4, textAlign: isCust ? 'right' : 'left' }}>
                    {isAI ? 'AI Assistant' : 'You'} · {time}
                  </Typography>
                  <Box sx={{
                    px: 2, py: 1.5,
                    borderRadius: isCust ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isCust
                      ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                      : isAI
                        ? 'rgba(16, 185, 129, 0.08)'
                        : 'rgba(30, 41, 59, 0.8)',
                    border: isAI ? '1px solid rgba(16, 185, 129, 0.2)' : 'none',
                  }}>
                    <Typography variant="body2" sx={{ color: isCust ? '#fff' : '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {msg.message}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}

          {/* Pending AI typing indicator */}
          {needsPolling(ticket) && (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
              <Box sx={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                color: '#fff',
              }}>
                AI
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.4 }}>
                  AI Assistant
                </Typography>
                <Box sx={{
                  px: 2, py: 1.5,
                  borderRadius: '16px 16px 16px 4px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px dashed rgba(16, 185, 129, 0.2)',
                  display: 'flex', alignItems: 'center', gap: 1,
                }}>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <Box key={i} sx={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#10b981',
                        animation: 'pulse 1.4s ease-in-out infinite',
                        animationDelay: `${i * 0.2}s`,
                        '@keyframes pulse': {
                          '0%, 80%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
                          '40%': { opacity: 1, transform: 'scale(1)' },
                        }
                      }} />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ color: '#6ee7b7', fontStyle: 'italic' }}>
                    Kindly check back shortly — automated response getting generated
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────
// Main dashboard
// ─────────────────────────────────────────────
const TicketDashboard = () => {
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.app?.tickets || []);

  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleViewDetails = (ticket) => setSelectedTicket(ticket);
  const handleCloseDetails = () => setSelectedTicket(null);

  // Called when polling inside modal finds updated ticket data
  const handleTicketUpdated = useCallback((updated) => {
    dispatch(updateTicket(updated));
    // Keep the modal in sync
    setSelectedTicket((prev) => (prev?.id === updated.id ? updated : prev));
  }, [dispatch]);

  // Called when a new ticket is created — immediately open its details (starts polling)
  const handleTicketCreated = useCallback((ticket) => {
    dispatch(addTicket(ticket));
    setOpen(false);
    setSelectedTicket(ticket);
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
            onClick={handleOpen}
            sx={{
              position: 'relative', zIndex: 1,
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              color: '#fff', px: 4, py: 1.8,
              borderRadius: '16px', fontSize: '1.05rem', fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              whiteSpace: 'nowrap',
              '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', transform: 'translateY(-4px)', boxShadow: '0 20px 30px -10px rgba(99, 102, 241, 0.7)' }
            }}
          >
            Create Ticket
          </Button>
        </Box>

        {/* Tickets List */}
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, px: 1, color: '#f1f5f9', animation: `${fadeIn} 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both` }}>
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
              <Grid item xs={12} sm={6} md={4} key={ticket.id}>
                <Grow in={true} timeout={800 + (index * 200)}>
                  <Box
                    onClick={() => handleViewDetails(ticket)}
                    sx={{
                      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(148, 163, 184, 0.1)',
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.4)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex', flexDirection: 'column',
                      p: 3.5, gap: 2, height: '100%',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.6)',
                        borderColor: 'rgba(59, 130, 246, 0.35)',
                        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                      }
                    }}
                  >
                    {/* Icon */}
                    <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))', border: '1px solid rgba(59, 130, 246, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                      <ConfirmationNumberOutlinedIcon sx={{ fontSize: '1.6rem' }} />
                    </Box>

                    <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, lineHeight: 1.35, flexGrow: 1 }}>
                      {ticket.title}
                    </Typography>

                    {ticket.created_at && (
                      <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                        {new Date(ticket.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Typography>
                    )}

                    <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={ticket.status || 'CREATED'}
                          size="small"
                          sx={{ bgcolor: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.25)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.5px' }}
                        />
                        {ticket.tag && (
                          <Chip
                            label={ticket.tag}
                            size="small"
                            sx={{ bgcolor: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.5px' }}
                          />
                        )}
                      </Box>
                      {/* Pulsing dot if awaiting AI */}
                      {!ticket.ai_response && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 1.4s ease-in-out infinite', '@keyframes pulse-dot': { '0%,100%': { opacity: 0.3, transform: 'scale(0.8)' }, '50%': { opacity: 1, transform: 'scale(1)' } } }} />
                          <Typography variant="caption" sx={{ color: '#10b981', fontSize: '0.65rem', fontWeight: 600 }}>AI</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grow>
              </Grid>
            ))
          )}
        </Grid>

        {/* Create Ticket */}
        <CreateTicket open={open} onClose={handleClose} onTicketCreated={handleTicketCreated} />

        {/* View Details Modal */}
        <Dialog
          open={!!selectedTicket}
          onClose={handleCloseDetails}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: '#0f172a',
              color: '#f1f5f9',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.7)',
              overflow: 'hidden',
              height: { xs: 'auto', md: '75vh' },
            }
          }}
        >
          {selectedTicket && (
            <TicketDetailModal
              ticket={selectedTicket}
              onClose={handleCloseDetails}
              onTicketUpdated={handleTicketUpdated}
            />
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default TicketDashboard;