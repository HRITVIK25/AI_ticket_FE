import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Typography, MenuItem
} from '@mui/material';
import { api } from '../../hooks/useAxios';
import { toast } from 'react-toastify';

const CreateTicket = ({ open, onClose, onTicketCreated }) => {
  const [newTicket, setNewTicket] = useState({ title: '', description: '', tag: '' });
  const [errors, setErrors] = useState({ title: false, description: false, tag: false });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchTags = async () => {
        setLoadingTags(true);
        try {
          const res = await api.get('api/v1/kb/tags');
          if (Array.isArray(res.data)) {
            setTags(res.data.map(t => typeof t === 'string' ? t : (t.tag || t.name)));
          }
        } catch (err) {
          console.error("Failed to fetch tags:", err);
        } finally {
          setLoadingTags(false);
        }
      };
      fetchTags();
    }
  }, [open]);

  const handleClose = () => {
    onClose();
    setNewTicket({ title: '', description: '', tag: '' });
    setErrors({ title: false, description: false, tag: false });
    setApiError('');
  };

  const handleCreate = async () => {
    const titleError = !newTicket.title.trim();
    const descError = !newTicket.description.trim();
    const tagError = !newTicket.tag.trim();
    
    if (titleError || descError || tagError) {
      setErrors({ title: titleError, description: descError, tag: tagError });
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await api.post('api/v1/tickets/', {
        title: newTicket.title,
        description: newTicket.description,
        tag: newTicket.tag
      });
      
      // Pass the returned ticket from the API
      // If the API just returns success, we pass what we have
      const createdTicket = response.data || {
        ...newTicket,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      };

      onTicketCreated(createdTicket);
      toast.success('Ticket created successfully!');
      handleClose();
    } catch (err) {
      console.error('Failed to create ticket:', err);
      setApiError('Failed to create ticket. Please try again later.');
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        sx: {
          background: '#1e293b',
          color: '#f1f5f9',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minWidth: { xs: '90%', sm: '500px' },
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
        pb: 2,
        pt: 3,
        px: 4,
        fontWeight: 700,
        fontSize: '1.5rem'
      }}>
        Create New Ticket
      </DialogTitle>
      <DialogContent sx={{ pt: '24px !important', px: 4 }}>
        <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {apiError && (
            <Typography color="error" variant="body2" sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', p: 1.5, borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              {apiError}
            </Typography>
          )}
          <TextField
            autoFocus
            label="Ticket Title"
            type="text"
            fullWidth
            required
            variant="outlined"
            value={newTicket.title}
            onChange={(e) => {
              setNewTicket({ ...newTicket, title: e.target.value });
              if (e.target.value.trim()) setErrors({ ...errors, title: false });
            }}
            error={errors.title}
            helperText={errors.title ? "Title is required" : ""}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f1f5f9',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
              },
              '& .Mui-disabled': {
                color: 'rgba(241, 245, 249, 0.5)',
                WebkitTextFillColor: 'rgba(241, 245, 249, 0.5)'
              }
            }}
          />
          <TextField
            label="Description"
            type="text"
            fullWidth
            required
            multiline
            rows={4}
            variant="outlined"
            value={newTicket.description}
            onChange={(e) => {
              setNewTicket({ ...newTicket, description: e.target.value });
              if (e.target.value.trim()) setErrors({ ...errors, description: false });
            }}
            error={errors.description}
            helperText={errors.description ? "Description is required" : ""}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f1f5f9',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
              },
              '& .Mui-disabled': {
                color: 'rgba(241, 245, 249, 0.5)',
                WebkitTextFillColor: 'rgba(241, 245, 249, 0.5)'
              }
            }}
          />

          <TextField
            select
            label="Tag"
            fullWidth
            required
            variant="outlined"
            value={newTicket.tag}
            onChange={(e) => {
              setNewTicket({ ...newTicket, tag: e.target.value });
              if (e.target.value.trim()) setErrors({ ...errors, tag: false });
            }}
            error={errors.tag}
            helperText={errors.tag ? "Tag is required" : ""}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            disabled={loading || loadingTags}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f1f5f9',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
              },
              '& .Mui-disabled': {
                color: 'rgba(241, 245, 249, 0.5)',
                WebkitTextFillColor: 'rgba(241, 245, 249, 0.5)'
              },
              '& .MuiSvgIcon-root': { color: '#94a3b8' }
            }}
          >
            {tags.length === 0 ? (
              <MenuItem value="" disabled>No tags available</MenuItem>
            ) : (
              tags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))
            )}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, px: 4, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{ 
            color: '#94a3b8',
            textTransform: 'none',
            fontWeight: 600,
            mr: 1
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleCreate} 
          disabled={loading}
          variant="contained" 
          sx={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: '8px',
            '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' },
            '&.Mui-disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)'
            }
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Submit Ticket'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTicket;