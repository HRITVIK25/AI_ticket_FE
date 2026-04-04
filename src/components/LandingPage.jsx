import { Typography, Button, Box, Container, Grid, Card, CardContent, Stack } from '@mui/material'
import SpeedIcon from '@mui/icons-material/Speed'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { SignInButton } from '@clerk/clerk-react'

const LandingPage = () => {
  return (
    <Box sx={{
      background: '#1e1e1e',
      minHeight: '100vh',
      color: '#d4d4d4',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* HERO */}
        <Box sx={{
          pt: { xs: 8, md: 14 },
          pb: { xs: 8, md: 12 },
          textAlign: 'center'
        }}>
          {/* Logo + Badge */}
          <Box sx={{ mb: 3, animation: 'fadeInUp 0.6s ease-out' }}>
            <Box
              component="img"
              src="/logo.svg"
              alt="AI Ticketing Logo"
              sx={{
                width: 80,
                height: 80,
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,122,204,0.3)',
              }}
            />
          </Box>
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


          {/* Feature pills */}
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

        {/* FEATURES SECTION */}
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
                icon: <Box component="img" src="/logo.svg" alt="AI" sx={{ width: 40, height: 40, borderRadius: '8px' }} />,
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
                      '&::before': { opacity: 1 }
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
                    <Typography variant="h5" sx={{ fontSize: '24px', fontWeight: 700, mb: 2, color: '#fff', letterSpacing: '-0.5px' }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.7 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA */}
        <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center', position: 'relative' }}>
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
            <Typography variant="h3" sx={{ fontSize: { xs: '32px', md: '44px' }, fontWeight: 800, mb: 2, letterSpacing: '-1px', color: '#e6e6e6' }}>
              Stop reacting. Start predicting.
            </Typography>
            <Typography sx={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.7)', mb: 5, lineHeight: 1.6 }}>
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

export default LandingPage