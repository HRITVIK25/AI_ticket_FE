import React, { useState, useEffect } from 'react'
import { Typography, Button, Box, Container, Grid, Card, CardContent, Grow } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { keyframes } from '@mui/system'
import { useSelector, useDispatch } from 'react-redux'
import CreateTicket from './Ticket/CreateTicket'
import { addTicket, setTickets } from '../app/appSlice'
import { api } from '../hooks/useAxios'

// subtle entry animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`

const Dashboard = () => {
  const dispatch = useDispatch()
  // Extract user info from Redux store, falling back to 'Guest'
  const userInfo = useSelector((state) => state.app?.userInfo)
  const userName = userInfo?.firstName || userInfo?.fullName || userInfo?.username || 'Guest'

  const tickets = useSelector((state) => state.app?.tickets || [])
  const openTickets = tickets.filter(t => t.status !== 'CLOSED').length
  const resolvedTickets = tickets.filter(t => t.status === 'CLOSED').length

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleTicketCreated = (ticket) => {
    dispatch(addTicket(ticket))
  }

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('api/v1/tickets/all')
        if (Array.isArray(response.data)) {
          dispatch(setTickets(response.data))
        }
      } catch (err) {
        console.error('Failed to fetch tickets:', err)
      }
    }
    fetchTickets()
  }, [dispatch])

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
        {/* Welcome Section */}
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
              Hello, {userName}
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', lineHeight: 1.6 }}>
              Welcome to your personal support hub. Here, you can submit new inquiries, monitor the progress of your active tickets, and access your problem-resolution history.
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
            Create New Ticket
          </Button>
        </Box>

        {/* Stats Header */}
        <Typography variant="h5" sx={{ 
          mb: 4, 
          fontWeight: 700, 
          px: 1, 
          color: '#f1f5f9', 
          animation: `${fadeIn} 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both` 
        }}>
          Ticket Overview
        </Typography>

        {/* Stats cards */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Grow in={true} timeout={800}>
              <Card sx={{
                background: 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
                borderRadius: '24px',
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  background: 'rgba(30, 41, 59, 0.6)'
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      p: 1.8, 
                      borderRadius: '16px', 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      mr: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#60a5fa'
                    }}>
                      <ConfirmationNumberOutlinedIcon sx={{ fontSize: '1.8rem' }} />
                    </Box>
                    <Typography sx={{ color: '#cbd5e1', fontSize: '1.25rem', fontWeight: 600 }}>Open Tickets</Typography>
                  </Box>
                  <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800, pl: 2, mb: 1 }}>{openTickets}</Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', pl: 2, fontSize: '0.95rem' }}>
                    Awaiting resolution from our support team.
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grow in={true} timeout={1000}>
              <Card sx={{
                background: 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
                borderRadius: '24px',
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  background: 'rgba(30, 41, 59, 0.6)'
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      p: 1.8, 
                      borderRadius: '16px', 
                      background: 'rgba(16, 185, 129, 0.1)', 
                      mr: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34d399'
                    }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: '1.8rem' }} />
                    </Box>
                    <Typography sx={{ color: '#cbd5e1', fontSize: '1.25rem', fontWeight: 600 }}>Resolved</Typography>
                  </Box>
                  <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800, pl: 2, mb: 1 }}>{resolvedTickets}</Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', pl: 2, fontSize: '0.95rem' }}>
                    Successfully closed and resolved issues.
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        <CreateTicket 
          open={open} 
          onClose={handleClose} 
          onTicketCreated={handleTicketCreated} 
        />
      </Container>
    </Box>
  )
}

export default Dashboard