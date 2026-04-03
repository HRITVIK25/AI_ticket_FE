import React from 'react';
import { Box, Typography, Grid, Grow, Chip } from '@mui/material';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';

// ─────────────────────────────────────────────
// TicketList — renders the grid of ticket cards
// ─────────────────────────────────────────────
const TicketList = ({ tickets, onViewDetails }) => {
  if (tickets.length === 0) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#94a3b8' }}>
              No tickets found. Create a new one to get started.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {tickets.map((ticket, index) => (
        <Grid item xs={12} sm={6} md={4} key={ticket.id}>
          <Grow in={true} timeout={800 + index * 200}>
            <Box
              onClick={() => onViewDetails(ticket)}
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
              <Box sx={{
                width: 52, height: 52, borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa'
              }}>
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
                    sx={{
                      bgcolor: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.5px'
                    }}
                  />
                  {ticket.tag && (
                    <Chip
                      label={ticket.tag}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(16, 185, 129, 0.12)', color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.5px'
                      }}
                    />
                  )}
                </Box>

                {/* Pulsing dot if awaiting AI */}
                {!ticket.ai_response && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{
                      width: 7, height: 7, borderRadius: '50%', background: '#10b981',
                      animation: 'pulse-dot 1.4s ease-in-out infinite',
                      '@keyframes pulse-dot': {
                        '0%,100%': { opacity: 0.3, transform: 'scale(0.8)' },
                        '50%': { opacity: 1, transform: 'scale(1)' }
                      }
                    }} />
                    <Typography variant="caption" sx={{ color: '#10b981', fontSize: '0.65rem', fontWeight: 600 }}>AI</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grow>
        </Grid>
      ))}
    </Grid>
  );
};

export default TicketList;