import { Typography, Button, Box, Container, Grid, Card, CardContent } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

const Dashboard = () => {

  return (
    <Box sx={{
      background: '#1e1e1e',
      minHeight: '100vh',
      color: '#d4d4d4',
      fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        {/* Header row */}
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

        {/* Stats cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{
              background: '#252526',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, fontWeight: 500 }}>Open Tickets</Typography>
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>0</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{
              background: '#252526',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, fontWeight: 500 }}>Resolved</Typography>
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>0</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Third card slot — reserved / uncomment when needed */}
          <Grid item xs={12} md={4} />
        </Grid>
      </Container>
    </Box>
  )
}

export default Dashboard