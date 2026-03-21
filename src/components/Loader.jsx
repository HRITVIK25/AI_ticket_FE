import { Box, Typography } from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'

const Loader = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1, // Fill remaining space in parent flex column
        gap: 3,
        fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Animated icon container */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer pulse ring */}
        <Box
          sx={{
            position: 'absolute',
            width: 72,
            height: 72,
            borderRadius: '50%',
            border: '1.5px solid rgba(0, 122, 204, 0.35)',
            animation: 'pingOuter 2s ease-in-out infinite',
            '@keyframes pingOuter': {
              '0%': { transform: 'scale(1)', opacity: 0.6 },
              '100%': { transform: 'scale(1.9)', opacity: 0 },
            },
          }}
        />
        {/* Middle pulse ring */}
        <Box
          sx={{
            position: 'absolute',
            width: 72,
            height: 72,
            borderRadius: '50%',
            border: '1.5px solid rgba(0, 122, 204, 0.5)',
            animation: 'pingMiddle 2s ease-in-out 0.4s infinite',
            '@keyframes pingMiddle': {
              '0%': { transform: 'scale(1)', opacity: 0.7 },
              '100%': { transform: 'scale(1.5)', opacity: 0 },
            },
          }}
        />
        {/* Icon box */}
        <Box
          sx={{
            background: '#007acc',
            borderRadius: '14px',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 1px rgba(0,122,204,0.2)',
            animation: 'iconPulse 2s ease-in-out infinite',
            '@keyframes iconPulse': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.06)' },
            },
          }}
        >
          <SmartToyIcon sx={{ fontSize: 32, color: '#fff' }} />
        </Box>
      </Box>

      {/* Segmented progress bar */}
      <Box
        sx={{
          display: 'flex',
          gap: '5px',
          alignItems: 'center',
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            sx={{
              width: i === 2 ? 28 : 8,
              height: 4,
              borderRadius: '2px',
              background: '#007acc',
              animation: 'segFade 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.12}s`,
              '@keyframes segFade': {
                '0%, 100%': { opacity: 0.2 },
                '50%': { opacity: 1 },
              },
            }}
          />
        ))}
      </Box>

      {/* Message */}
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'rgba(212,212,212,0.5)',
          letterSpacing: '0.3px',
          animation: 'textFade 2s ease-in-out infinite',
          '@keyframes textFade': {
            '0%, 100%': { opacity: 0.5 },
            '50%': { opacity: 1 },
          },
        }}
      >
        {message}
      </Typography>
    </Box>
  )
}

export default Loader