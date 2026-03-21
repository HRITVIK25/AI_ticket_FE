import { AppBar, Toolbar, Typography, Button, Box, Container, Grid, Card, CardContent, Stack } from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SpeedIcon from '@mui/icons-material/Speed'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AddIcon from '@mui/icons-material/Add'
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react'

const Home = () => {
  const { isSignedIn, user } = useUser()

  if (isSignedIn) {
    return (
      <Box sx={{ 
        background: '#1e1e1e',
        minHeight: '100vh',
        color: '#d4d4d4',
        position: 'relative',
        fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        {/* DASHBOARD NAVBAR */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            background: '#252526',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 4 }}>
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

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 1 }}>
                <Typography sx={{ cursor: 'pointer', fontWeight: 500, '&:hover': { color: '#007acc' }, transition: 'color 0.2s' }}>
                  Knowledge Bases
                </Typography>
                <Typography sx={{ cursor: 'pointer', fontWeight: 500, '&:hover': { color: '#007acc' }, transition: 'color 0.2s' }}>
                  Tickets
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 500, color: '#d4d4d4' }}>
                  {user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User'}
                </Typography>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: { width: '40px', height: '40px' }
                    }
                  }}
                />
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* DASHBOARD CONTENT */}
        <Container maxWidth="xl" sx={{ mt: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#e6e6e6' }}>
              Dashboard
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              sx={{ 
                background: '#007acc',
                color: '#fff',
                px: 3,
                py: 1.2,
                borderRadius: '8px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0,122,204,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': { background: '#005a9e', transform: 'translateY(-2px)' }
              }}
            >
              Create Ticket
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
               <Card sx={{ background: '#252526', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                 <CardContent sx={{ p: 4 }}>
                   <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, fontWeight: 500 }}>Open Tickets</Typography>
                   <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>0</Typography>
                 </CardContent>
               </Card>
            </Grid>
            <Grid item xs={12} md={4}>
               <Card sx={{ background: '#252526', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                 <CardContent sx={{ p: 4 }}>
                   <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, fontWeight: 500 }}>Resolved</Typography>
                   <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>0</Typography>
                 </CardContent>
               </Card>
            </Grid>
            <Grid item xs={12} md={4}>
               {/* <Card sx={{ background: '#252526', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                 <CardContent sx={{ p: 4 }}>
                   <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, fontWeight: 500 }}>Knowledge Bases</Typography>
                   <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>0</Typography>
                 </CardContent>
               </Card> */}
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      background: '#1e1e1e',
      minHeight: '100vh',
      color: '#d4d4d4',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    }}>

      {/* NAVBAR */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: '#252526',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
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
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '22px',
                  letterSpacing: '-0.5px',
                  color: '#d4d4d4',
                }}
              >
                AI Ticketing
              </Typography>
            </Box>
            {isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: {
                      width: '40px',
                      height: '40px',
                    }
                  }
                }}
              />
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
          </Toolbar>
        </Container>
      </AppBar>

      {/* HERO */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          pt: { xs: 8, md: 14 }, 
          pb: { xs: 8, md: 12 },
          textAlign: 'center'
        }}>
          {/* Badge */}
          <Box 
            sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2.5,
              py: 1,
              mb: 4,
              background: 'rgba(0,122,204,0.06)',
              border: '1px solid rgba(0,122,204,0.14)',
              borderRadius: '50px',
              backdropFilter: 'blur(10px)',
              animation: 'fadeInUp 0.8s ease-out',
              '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            <Box sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#007acc',
              boxShadow: '0 0 8px rgba(0,122,204,0.6)',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 }
              }
            }} />
            <Typography sx={{ 
              fontSize: '14px', 
              fontWeight: 600,
              color: '#9ccfff',
              letterSpacing: '0.5px'
            }}>
              Powered by Advanced AI
            </Typography>
          </Box>

          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '42px', md: '72px' },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 3,
              letterSpacing: '-2px',
              color: '#e6e6e6',
              animation: 'fadeInUp 1s ease-out 0.2s both',
            }}
          >
            AI-Driven Support<br />That Actually Scales
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: { xs: '18px', md: '22px' },
              color: 'rgba(212,212,212,0.85)',
              mb: 5,
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6,
              fontWeight: 400,
              animation: 'fadeInUp 1s ease-out 0.4s both',
            }}
          >
            Automate ticket responses, improve response times, and help support teams resolve issues faster with real intelligence.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mb: 6, animation: 'fadeInUp 1s ease-out 0.6s both' }}
          >
            <SignInButton mode="modal">
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  background: '#007acc',
                  color: '#fff',
                  px: 4,
                  py: 1.8,
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 8px 30px rgba(0,122,204,0.18)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px rgba(0,122,204,0.22)',
                  }
                }}
              >
                Get Started
              </Button>
            </SignInButton>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                color: '#d4d4d4',
                borderColor: 'rgba(212,212,212,0.06)',
                px: 4,
                py: 1.8,
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(0,122,204,0.18)',
                  background: 'rgba(0,122,204,0.06)',
                  transform: 'translateY(-3px)',
                }
              }}
            >
              View Dashboard
            </Button>
          </Stack>

          {/* Features Grid */}
          <Grid 
            container 
            spacing={2} 
            justifyContent="center"
            sx={{ 
              maxWidth: '900px', 
              mx: 'auto',
              animation: 'fadeInUp 1s ease-out 0.8s both',
            }}
          >
            {[
              'AI response generation',
              'Sentiment-based priority',
              'Centralized communication'
            ].map((feature, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: 'center',
                  py: 2,
                  px: 2,
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    transform: 'translateY(-4px)',
                  }
                }}>
                  <Box sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#007acc',
                    boxShadow: '0 0 6px rgba(0,122,204,0.55)',
                    flexShrink: 0
                  }} />
                  <Typography sx={{ 
                    fontSize: '14px', 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 500
                  }}>
                    {feature}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FEATURES */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { xs: '32px', md: '48px' },
              fontWeight: 800,
              textAlign: 'center',
              mb: 2,
              letterSpacing: '-1px',
              color: '#e6e6e6'
            }}
          >
            Built for Modern Support Teams
          </Typography>
          
          <Typography 
            sx={{ 
              textAlign: 'center',
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.6)',
              mb: 8,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Everything you need to transform your support operations
          </Typography>

          <Grid container spacing={3}>
            {[
              { 
                icon: <SmartToyIcon sx={{ fontSize: 40, color: '#9ccfff' }} />, 
                title: 'AI Auto Replies', 
                desc: 'Context-aware responses generated using internal knowledge base.' 
              },
              { 
                icon: <SpeedIcon sx={{ fontSize: 40, color: '#9ccfff' }} />, 
                title: 'Response Time Insights', 
                desc: 'Detect response time issues before they impact customers.' 
              },
              { 
                icon: <SupportAgentIcon sx={{ fontSize: 40, color: '#9ccfff' }} />, 
                title: 'Agent Assist', 
                desc: 'Help support agents with suggestions, summaries, and priorities.' 
              },
              { 
                icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#9ccfff' }} />, 
                title: 'Operational Insights', 
                desc: 'Track performance, delays, sentiment, and resolution quality.' 
              }
            ].map((item, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #007acc 0%, #005a9e 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      boxShadow: '0 20px 60px rgba(99, 102, 241, 0.2)',
                      '&::before': {
                        opacity: 1,
                      }
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ 
                      display: 'inline-flex',
                      p: 2,
                      mb: 3,
                      borderRadius: '12px',
                      background: 'rgba(0,122,204,0.08)',
                      border: '1px solid rgba(0,122,204,0.12)',
                      color: '#9ccfff',
                      transition: 'all 0.3s ease',
                    }}>
                      {item.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontSize: '24px',
                        fontWeight: 700,
                        mb: 2,
                        color: '#fff',
                        letterSpacing: '-0.5px'
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '16px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.7
                    }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA */}
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 },
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Box sx={{
            maxWidth: '800px',
            mx: 'auto',
            p: { xs: 4, md: 6 },
            background: '#252526',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '32px', md: '44px' },
                fontWeight: 800,
                mb: 2,
                letterSpacing: '-1px',
                color: '#e6e6e6'
              }}
            >
              Stop reacting. Start predicting.
            </Typography>
            <Typography 
              sx={{ 
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 5,
                lineHeight: 1.6
              }}
            >
              Move from manual ticket handling to intelligent, automated support workflows.
            </Typography>
            <SignInButton mode="modal">
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  background: '#007acc',
                  color: '#fff',
                  px: 5,
                  py: 2,
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 12px 40px rgba(0,122,204,0.18)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 50px rgba(0,122,204,0.22)',
                  }
                }}
              >
                Login to Platform
              </Button>
            </SignInButton>
          </Box>
        </Box>
      </Container>

      {/* Footer gradient */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(to top, #1e1e1e, transparent)',
        pointerEvents: 'none',
      }} />
    </Box>
  )
}

export default Home