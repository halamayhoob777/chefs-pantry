import React from 'react';
import { Box, Typography, IconButton, InputBase } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LanguageIcon from '@mui/icons-material/Language';
import ShareIcon from '@mui/icons-material/Share';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const productLinks = ['Recipe Search', 'Meal Planner', 'Pantry Management', 'Pricing'];
const companyLinks = ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'];

export const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 5, pb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1.4fr 1fr 1fr 1.4fr' },
          gap: 4,
          mb: 4,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <RestaurantMenuIcon color="primary" sx={{ fontSize: 22 }} />
            <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>Chef's Pantry</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 260 }}>
            Reducing kitchen waste, one recipe at a time. Discover new dishes with ingredients you already own.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" sx={{ bgcolor: 'action.hover' }}>
              <LanguageIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ bgcolor: 'action.hover' }}>
              <ShareIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.9rem' }}>Product</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {productLinks.map((link) => (
              <Typography
                key={link}
                variant="body2"
                color="text.secondary"
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              >
                {link}
              </Typography>
            ))}
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.9rem' }}>Company</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {companyLinks.map((link) => (
              <Typography
                key={link}
                variant="body2"
                color="text.secondary"
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              >
                {link}
              </Typography>
            ))}
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.9rem' }}>Stay Inspired</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Get weekly recipe recommendations and insights in your inbox.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#F1F0FB',
              borderRadius: 3,
              pl: 2,
              pr: 0.5,
              py: 0.5,
            }}
          >
            <InputBase placeholder="Email address" sx={{ flex: 1, fontSize: '0.85rem' }} />
            <IconButton size="small" sx={{ bgcolor: 'secondary.main', color: '#fff', '&:hover': { bgcolor: '#EA680C' } }}>
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
        © 2026 Chef's Pantry. All rights reserved.
      </Typography>
    </Box>
  );
};
