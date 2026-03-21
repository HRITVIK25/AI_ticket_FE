import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { isSignedIn, user } = useUser()
  const navigate = useNavigate()

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
            <Box sx={{
              background: '#007acc',
              borderRadius: '8px',
              p: 0.8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,122,204,0.25)'
            }}>
              <SmartToyIcon sx={{ fontSize: 26, color: '#fff' }} />
            </Box>
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
              <Typography 
                onClick={() => navigate('/knowledge-bases')}
                sx={{ cursor: 'pointer', fontWeight: 500, color: '#d4d4d4', '&:hover': { color: '#007acc' }, transition: 'color 0.2s' }}
              >
                Knowledge Bases
              </Typography>
              <Typography 
                onClick={() => navigate('/tickets')}
                sx={{ cursor: 'pointer', fontWeight: 500, color: '#d4d4d4', '&:hover': { color: '#007acc' }, transition: 'color 0.2s' }}
              >
                Tickets
              </Typography>
            </Box>
          )}

          {/* Auth area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isSignedIn ? (
              <>
                <Typography sx={{ fontWeight: 500, color: '#d4d4d4' }}>
                  {user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User'}
                </Typography>
                <UserButton
                  appearance={{
                    elements: { avatarBox: { width: '40px', height: '40px' } }
                  }}
                />
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