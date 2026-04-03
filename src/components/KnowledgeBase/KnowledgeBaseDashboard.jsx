import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Container, Typography, Button, Grid, Card, Grow, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import { keyframes } from '@mui/system';
import CreateKnowledgeBase from './CreateKnowledgeBase';
import ViewKnowledgeBase from './ViewKnowledgeBase';
import { addKnowledgeBase, setKnowledgeBases } from '../../app/appSlice';
import { api } from '../../hooks/useAxios';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const KnowledgeBaseDashboard = () => {
  const dispatch = useDispatch();
  const knowledgeBases = useSelector((state) => state.app?.knowledgeBases || []);

  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedKb, setSelectedKb] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleViewOpen = (kb) => {
    setSelectedKb(kb);
    setViewOpen(true);
  };
  const handleViewClose = () => setViewOpen(false);

  const handleKnowledgeBaseCreated = (kb) => {
    dispatch(addKnowledgeBase(kb));
  };

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      try {
        const response = await api.get('api/v1/kb/all');
        if (Array.isArray(response.data)) {
          dispatch(setKnowledgeBases(response.data));
        }
      } catch (err) {
        console.error('Failed to fetch knowledge bases:', err);
      }
    };
    fetchKnowledgeBases();
  }, [dispatch]);

  return (
    <Box
      sx={{
        background: 'linear-gradient(145deg, #090e17 0%, #162032 100%)',
        minHeight: '100vh',
        color: '#e2e8f0',
        fontFamily: '"Inter", "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
        pt: { xs: 6, md: 10 },
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
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
            overflow: 'hidden',
          }}
        >
          {/* Gradient accent */}
          <Box
            sx={{
              position: 'absolute',
              top: '-50%', left: '-20%',
              width: '60%', height: '150%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #fff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-1px',
              }}
            >
              Knowledge Bases
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', lineHeight: 1.6 }}>
              Manage your AI knowledge sources. Upload documents to power intelligent responses.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{
              position: 'relative', zIndex: 1,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
              px: 4, py: 1.8,
              borderRadius: '16px',
              fontSize: '1.05rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              whiteSpace: 'nowrap',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 30px -10px rgba(99, 102, 241, 0.7)',
              },
            }}
          >
            Create Knowledge Base
          </Button>
        </Box>

        {/* List Section */}
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 700,
            px: 1,
            color: '#f1f5f9',
            animation: `${fadeIn} 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both`,
          }}
        >
          All Knowledge Bases
        </Typography>

        <Grid container spacing={3}>
          {knowledgeBases.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <AutoStoriesOutlinedIcon sx={{ fontSize: '3rem', color: '#334155', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#94a3b8' }}>
                  No knowledge bases yet. Create one to get started.
                </Typography>
              </Box>
            </Grid>
          ) : (
            knowledgeBases.map((kb, index) => (
              <Grid item xs={12} sm={6} md={4} key={kb.id}>
                <Grow in={true} timeout={800 + index * 200}>
                  <Card
                    sx={{
                      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(148, 163, 184, 0.1)',
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.4)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3.5,
                      gap: 2,
                      height: '100%',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.6)',
                        borderColor: 'rgba(99, 102, 241, 0.35)',
                        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                      },
                    }}
                    onClick={() => handleViewOpen(kb)}
                  >
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 52, height: 52,
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#818cf8',
                      }}
                    >
                      <AutoStoriesOutlinedIcon sx={{ fontSize: '1.6rem' }} />
                    </Box>

                    {/* Title */}
                    <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, lineHeight: 1.35, flexGrow: 1 }}>
                      {kb.title}
                    </Typography>

                    {/* Description */}
                    {kb.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#94a3b8',
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {kb.description}
                      </Typography>
                    )}

                    {/* Tag */}
                    {kb.tag && (
                      <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                         <Typography variant="caption" sx={{ color: '#475569', mr: 1 }}>
                           Tag:
                         </Typography>
                         <Chip
                           label={kb.tag}
                           size="small"
                           sx={{
                             bgcolor: 'rgba(16, 185, 129, 0.1)',
                             color: '#34d399',
                             border: '1px solid rgba(16, 185, 129, 0.2)',
                             fontWeight: 600,
                             fontSize: '0.65rem',
                           }}
                         />
                      </Box>
                    )}

                    {/* Divider */}
                    <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

                    {/* File count chip */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      {(kb.file_names || kb.files)?.length > 0 ? (
                        <Chip
                          label={`${(kb.file_names || kb.files).length} file${(kb.file_names || kb.files).length !== 1 ? 's' : ''}`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(99, 102, 241, 0.12)',
                            color: '#a5b4fc',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            letterSpacing: '0.5px',
                          }}
                        />
                      ) : (
                        <Chip
                          label="No files"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(148, 163, 184, 0.08)',
                            color: '#64748b',
                            border: '1px solid rgba(148, 163, 184, 0.15)',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                    </Box>
                  </Card>
                </Grow>
              </Grid>
            ))
          )}
        </Grid>

        {/* Create Knowledge Base Modal */}
        <CreateKnowledgeBase
          open={open}
          onClose={handleClose}
          onKnowledgeBaseCreated={handleKnowledgeBaseCreated}
        />

        {/* View Knowledge Base Modal */}
        <ViewKnowledgeBase
          open={viewOpen}
          onClose={handleViewClose}
          kb={selectedKb}
        />
      </Container>
    </Box>
  );
};

export default KnowledgeBaseDashboard;