import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Container, Typography, Chip, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { keyframes } from '@mui/system';
import { setTickets, updateTicket } from '../../app/appSlice';
import { api } from '../../hooks/useAxios';
import TicketList from './TicketList';
import TicketDetailModal from "./TicketDetailModal";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const statusColors = {
  CREATED:      { bg: 'rgba(59,130,246,0.12)',  text: '#60a5fa',  border: 'rgba(59,130,246,0.25)' },
  AI_RESPONDED: { bg: 'rgba(16,185,129,0.12)',  text: '#34d399',  border: 'rgba(16,185,129,0.25)' },
  ASSIGNED:     { bg: 'rgba(139,92,246,0.12)',  text: '#eb5c5cff',  border: 'rgba(139,92,246,0.25)' },
  CLOSED:       { bg: 'rgba(100,116,139,0.12)', text: '#94a3b8',  border: 'rgba(100,116,139,0.25)' },
};
const statusStyle = (s) => statusColors[s] || statusColors.CREATED;

// ─────────────────────────────────────────────
// Open Tickets — admin view (read-only, no create)
// ─────────────────────────────────────────────
const OpenTickets = () => {
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.app?.tickets || []);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tagFilter, setTagFilter] = useState('ALL');

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

  const handleTicketUpdated = useCallback((updated) => {
    dispatch(updateTicket(updated));
    setSelectedTicket(prev => prev?.id === updated.id ? updated : prev);
  }, [dispatch]);

  const statuses = ['ALL', 'CREATED', 'AI_RESPONDED', 'ASSIGNED', 'CLOSED'];
  const availableTags = ['ALL', ...Array.from(new Set(tickets.map(t => t.tag).filter(Boolean)))];

  const filtered = tickets.filter((t) => {
    const matchesSearch = !search || t.title?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()) || t.tag?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesTag = tagFilter === 'ALL' || t.tag === tagFilter;
    return matchesSearch && matchesStatus && matchesTag;
  });

  return (
    <Box sx={{ background: 'linear-gradient(145deg, #090e17 0%, #162032 100%)', minHeight: '100vh', color: '#e2e8f0', fontFamily: '"Inter","DM Sans",-apple-system,BlinkMacSystemFont,sans-serif', pt: { xs: 6, md: 10 }, pb: 8 }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Box sx={{ animation: `${fadeIn} 0.7s cubic-bezier(0.4,0,0.2,1)`, mb: 6, p: { xs: 4, md: 5 }, borderRadius: '24px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: '-50%', left: '-20%', width: '60%', height: '150%', background: 'radial-gradient(circle,rgba(99,102,241,0.1) 0%,rgba(0,0,0,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, background: 'linear-gradient(135deg,#fff,#94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
              Open Tickets
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', lineHeight: 1.6 }}>
              Review and monitor all incoming support tickets across your organisation.
            </Typography>
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            placeholder="Search tickets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#64748b', fontSize: '1.1rem' }} /></InputAdornment> }}
            sx={{ maxWidth: 400, '& .MuiOutlinedInput-root': { color: '#f1f5f9', borderRadius: '10px', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#6366f1' } } }}
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {/* Status Filter */}
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Filter by Status
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {statuses.map((s) => {
                  const ss = s !== 'ALL' ? statusStyle(s) : null;
                  const active = statusFilter === s;
                  return (
                    <Chip
                      key={s}
                      label={s}
                      onClick={() => setStatusFilter(s)}
                      size="small"
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        letterSpacing: '0.4px',
                        bgcolor: active ? (ss?.bg || 'rgba(99,102,241,0.2)') : 'rgba(255,255,255,0.04)',
                        color: active ? (ss?.text || '#a5b4fc') : '#64748b',
                        border: `1px solid ${active ? (ss?.border || 'rgba(99,102,241,0.4)') : 'rgba(255,255,255,0.08)'}`,
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: ss?.bg || 'rgba(99,102,241,0.12)', color: ss?.text || '#a5b4fc' }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Tag Filter */}
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Filter by Tag
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {availableTags.map((t) => {
                  const active = tagFilter === t;
                  return (
                    <Chip
                      key={t}
                      label={t}
                      onClick={() => setTagFilter(t)}
                      size="small"
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        letterSpacing: '0.4px',
                        bgcolor: active ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)',
                        color: active ? '#34d399' : '#64748b',
                        border: `1px solid ${active ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'rgba(16,185,129,0.12)', color: '#34d399' }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, px: 1, color: '#f1f5f9', animation: `${fadeIn} 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s both` }}>
          {filtered.length} Ticket{filtered.length !== 1 ? 's' : ''} {statusFilter !== 'ALL' ? `· ${statusFilter}` : ''} {tagFilter !== 'ALL' ? `· ${tagFilter}` : ''}
        </Typography>

        <TicketList
          tickets={filtered}
          onViewDetails={setSelectedTicket}
        />

        <TicketDetailModal
          ticket={selectedTicket}
          open={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onTicketUpdated={handleTicketUpdated}
          isAdmin={true}
        />
        
      </Container>
    </Box>
  );
};

export default OpenTickets;
