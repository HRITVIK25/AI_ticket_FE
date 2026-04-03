import { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Container, Menu, MenuItem } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { SignInButton, useUser, useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../hooks/useAxios'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const Navbar = () => {
  const { isSignedIn } = useUser()
  const userInfo = useSelector((state) => state.app.userInfo)
  const isAdmin = userInfo?.role === 'ticket_admin'
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = async () => {
    handleMenuClose()
    await signOut()
  }

  const checkHealth = async () => {
    try {
      const res = await api.get("/api/v1/health")
      toast.success(res.data?.message || "Health check successful!")
    } catch (error) {
      toast.error("Health check failed!")
      console.error(error)
    }
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: '#252526',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
      }}
    >
      <Container maxWidth={isSignedIn ? 'xl' : 'lg'}>
        <Toolbar sx={{ py: 1.5 }}>
          {/* Logo */}
          <Box 
            onClick={() => navigate(isSignedIn ? '/home' : '/')}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              mr: isSignedIn ? 4 : 0, 
              flexGrow: isSignedIn ? 0 : 1, 
              cursor: 'pointer' 
            }}
          >
            <Box
              component="img"
              src="/logo.svg"
              alt="AI Ticketing Logo"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,122,204,0.25)',
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '22px', letterSpacing: '-0.5px', color: '#d4d4d4' }}>
              AI Ticketing
            </Typography>
          </Box>

          {/* Dashboard nav links */}
          {isSignedIn && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 1 }}>
              <Typography 
                onClick={() => navigate('/home')}
                sx={{ cursor: 'pointer', fontWeight: 500, color: '#d4d4d4', '&:hover': { color: '#007acc' }, transition: 'color 0.2s' }}
              >
                Dashboard
              </Typography>
              {isAdmin && (
                <Typography 
                  onClick={() => navigate('/knowledge-bases')}
                  sx={{ cursor: 'pointer', fontWeight: 500, color: '#d4d4d4', '&:hover': { color: '#007acc' }, transition: 'color 0.2s' }}
                >
                  Knowledge Bases
                </Typography>
              )}
              {!isAdmin && (
                <Typography 
                  onClick={() => navigate('/tickets')}
                  sx={{ cursor: 'pointer', fontWeight: 500, color: '#d4d4d4', '&:hover': { color: '#007acc' }, transition: 'color 0.2s' }}
                >
                  Tickets
                </Typography>
              )}
              {isAdmin && (
                <Typography 
                  onClick={() => navigate('/open-tickets')}
                  sx={{ cursor: 'pointer', fontWeight: 500, color: '#d4d4d4', '&:hover': { color: '#007acc' }, transition: 'color 0.2s' }}
                >
                  Open Tickets
                </Typography>
              )}
              {isAdmin && (
                <Typography
                  onClick={checkHealth}
                  sx={{ cursor: 'pointer', fontWeight: 500, color: '#d4d4d4', '&:hover': { color: '#007acc' }, transition: 'color 0.2s' }}
                >
                  Health Check
                </Typography>
              )}
            </Box>
          )}

          {/* Auth area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isSignedIn ? (
              <>
                <Button 
                  onClick={handleMenuClick}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ 
                    color: '#d4d4d4', 
                    textTransform: 'none', 
                    fontWeight: 500,
                    fontSize: '15px',
                    '&:hover': { background: 'rgba(255,255,255,0.05)' }
                  }}
                >
                  {userInfo?.firstName || userInfo?.email || 'User'}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      background: '#252526',
                      color: '#d4d4d4',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      minWidth: '150px'
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem 
                    onClick={handleSignOut}
                    sx={{ '&:hover': { background: 'rgba(255,255,255,0.05)' }, fontWeight: 500, color: '#ff6b6b' }}
                  >
                    Sign out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="outlined"
                  sx={{
                    color: '#d4d4d4',
                    borderColor: 'rgba(212,212,212,0.08)',
                    borderRadius: '10px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontSize: '15px',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#007acc',
                      background: 'rgba(0,122,204,0.08)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0,122,204,0.12)'
                    }
                  }}
                >
                  Login
                </Button>
              </SignInButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar