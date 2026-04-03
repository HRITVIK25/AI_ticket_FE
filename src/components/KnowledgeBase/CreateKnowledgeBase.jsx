import React, { useState, useRef } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress, Typography, IconButton, Chip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { api } from '../../hooks/useAxios';
import { toast } from 'react-toastify';

const ALLOWED_TYPES = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/msword': 'DOC',
  'text/plain': 'TXT',
};
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#f1f5f9',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
  },
  '& .Mui-disabled': {
    color: 'rgba(241, 245, 249, 0.5)',
    WebkitTextFillColor: 'rgba(241, 245, 249, 0.5)',
  },
};

const CreateKnowledgeBase = ({ open, onClose, onKnowledgeBaseCreated }) => {
  const [form, setForm] = useState({ title: '', description: '', tag: '' });
  const [errors, setErrors] = useState({ title: false, description: false, tag: false });
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setForm({ title: '', description: '', tag: '' });
    setErrors({ title: false, description: false, tag: false });
    setFiles([]);
    setFileError('');
    setApiError('');
    setDragging(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateFiles = (incoming) => {
    const valid = [];
    for (const file of incoming) {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setFileError(`"${file.name}" is not allowed. Only PDF, DOCX and TXT files are accepted.`);
        return [];
      }
      valid.push(file);
    }
    setFileError('');
    return valid;
  };

  const addFiles = (incoming) => {
    const valid = validateFiles(Array.from(incoming));
    if (!valid.length) return;
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const unique = valid.filter((f) => !existingNames.has(f.name));
      return [...prev, ...unique];
    });
  };

  const handleFileChange = (e) => addFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));

  const handleCreate = async () => {
    const titleError = !form.title.trim();
    const descError = !form.description.trim();
    const tagError = !form.tag.trim();
    if (titleError || descError || tagError) {
      setErrors({ title: titleError, description: descError, tag: tagError });
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      formData.append('tag', form.tag.trim());
      files.forEach((file) => formData.append('files', file));

      const response = await api.post('api/v1/kb/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const message = response.data?.message || 'Knowledge base created successfully!';
      const created = {
        ...form,
        id: response.data?.kb_id || Date.now(),
        created_at: new Date().toISOString(),
        files: files.map((f) => f.name),
      };

      onKnowledgeBaseCreated(created);
      toast.success(message);
      handleClose();
    } catch (err) {
      console.error('Failed to create knowledge base:', err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || 'Failed to create knowledge base. Please try again.';
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getFileTypeLabel = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    return (
      ALLOWED_TYPES[file.type] ||
      (ext === '.pdf' ? 'PDF' : ext === '.docx' || ext === '.doc' ? 'DOCX' : 'TXT')
    );
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
        Create Knowledge Base
        <IconButton onClick={handleClose} disabled={loading} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: '24px !important', px: 4 }}>
        <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {apiError && (
            <Typography
              color="error" variant="body2"
              sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', p: 1.5, borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              {apiError}
            </Typography>
          )}

          {/* Title */}
          <TextField
            autoFocus
            label="Title"
            fullWidth required
            variant="outlined"
            value={form.title}
            disabled={loading}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              if (e.target.value.trim()) setErrors({ ...errors, title: false });
            }}
            error={errors.title}
            helperText={errors.title ? 'Title is required' : ''}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            sx={inputSx}
          />

          {/* Description */}
          <TextField
            label="Description"
            fullWidth required multiline rows={3}
            variant="outlined"
            value={form.description}
            disabled={loading}
            onChange={(e) => {
              setForm({ ...form, description: e.target.value });
              if (e.target.value.trim()) setErrors({ ...errors, description: false });
            }}
            error={errors.description}
            helperText={errors.description ? 'Description is required' : ''}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            sx={inputSx}
          />

          {/* Tag */}
          <Box>
            <TextField
              label="Tag"
              fullWidth required
              variant="outlined"
              value={form.tag}
              disabled={loading}
              onChange={(e) => {
                setForm({ ...form, tag: e.target.value });
                if (e.target.value.trim()) setErrors({ ...errors, tag: false });
              }}
              error={errors.tag}
              helperText={errors.tag ? 'Tag is required' : ''}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              sx={inputSx}
            />
            <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.5, display: 'block', px: 1 }}>
              This tag will be displayed to user while creating tickets to map to correct KB for eg if dept is HR then write tag as Human resources or HR
            </Typography>
          </Box>

          {/* File Drop Zone */}
          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1, display: 'block' }}>
              Upload Files <span style={{ color: '#475569' }}>(PDF, DOCX, TXT)</span>
            </Typography>
            <Box
              onClick={() => !loading && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              sx={{
                border: `2px dashed ${dragging ? '#6366f1' : fileError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '12px',
                p: 3,
                textAlign: 'center',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                background: dragging
                  ? 'rgba(99, 102, 241, 0.07)'
                  : 'rgba(255, 255, 255, 0.02)',
                '&:hover': loading ? {} : {
                  borderColor: '#6366f1',
                  background: 'rgba(99, 102, 241, 0.05)',
                },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: '2rem', color: dragging ? '#818cf8' : '#475569', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Drag & drop files here or{' '}
                <span style={{ color: '#818cf8', fontWeight: 600 }}>browse</span>
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569' }}>
                PDF · DOCX · TXT
              </Typography>
            </Box>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={loading}
            />
            {fileError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {fileError}
              </Typography>
            )}
          </Box>

          {/* File list */}
          {files.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {files.map((file) => (
                <Chip
                  key={file.name}
                  icon={<InsertDriveFileOutlinedIcon sx={{ fontSize: '0.95rem !important' }} />}
                  label={`${getFileTypeLabel(file)} · ${file.name}`}
                  onDelete={() => removeFile(file.name)}
                  size="small"
                  disabled={loading}
                  sx={{
                    bgcolor: 'rgba(99, 102, 241, 0.12)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    maxWidth: '100%',
                    '& .MuiChip-deleteIcon': { color: '#6366f1' },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, px: 4, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ color: '#94a3b8', textTransform: 'none', fontWeight: 600, mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          disabled={loading}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            textTransform: 'none',
            fontWeight: 600,
            px: 3, py: 1,
            borderRadius: '8px',
            boxShadow: '0 8px 20px -6px rgba(99, 102, 241, 0.5)',
            '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' },
            '&.Mui-disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Create Knowledge Base'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateKnowledgeBase;