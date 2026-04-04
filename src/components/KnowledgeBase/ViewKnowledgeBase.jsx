import React from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, IconButton, Chip, Button, Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

const ViewKnowledgeBase = ({ open, onClose, kb }) => {
  if (!kb) return null;

  const fileNames = kb.file_names || kb.files || [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#1e293b',
          color: '#f1f5f9',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minWidth: { xs: '90%', sm: '560px' },
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          pb: 2, pt: 3, px: 4,
          fontWeight: 700, fontSize: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40, height: 40,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#818cf8',
            }}
          >
            <AutoStoriesOutlinedIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {kb.title}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: '24px !important', px: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', mb: 0.5, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ color: '#e2e8f0', lineHeight: 1.6 }}>
              {kb.description || 'No description provided.'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', mb: 0.5, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tag
              </Typography>
              <Chip
                icon={<LocalOfferOutlinedIcon sx={{ fontSize: '1rem !important' }} />}
                label={kb.tag || 'None'}
                size="small"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.12)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontWeight: 600,
                }}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', mb: 0.5, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Type
              </Typography>
              <Typography variant="body2" sx={{ color: '#e2e8f0', textTransform: 'capitalize', fontWeight: 500 }}>
                {kb.type || 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', mb: 0.5, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Created At
              </Typography>
              <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 500 }}>
                {kb.created_at ? new Date(kb.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />

          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1.5, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Files ({fileNames.length})
            </Typography>
            {fileNames.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {fileNames.map((fileName, idx) => (
                  <Chip
                    key={idx}
                    icon={<InsertDriveFileOutlinedIcon sx={{ fontSize: '0.95rem !important' }} />}
                    label={fileName}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(99, 102, 241, 0.12)',
                      color: '#a5b4fc',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      fontWeight: 600,
                      fontSize: '0.72rem',
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                No files attached.
              </Typography>
            )}
          </Box>

        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, px: 4, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            textTransform: 'none',
            fontWeight: 600,
            px: 3, py: 1,
            borderRadius: '8px',
            color: '#f1f5f9',
            '&:hover': { background: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewKnowledgeBase;
