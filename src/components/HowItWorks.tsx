import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import KitchenIcon from '@mui/icons-material/Kitchen';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import type { SvgIconComponent } from '@mui/icons-material';

interface Step {
  icon: SvgIconComponent;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: KitchenIcon,
    iconColor: '#10B981',
    iconBg: '#E6F4EA',
    title: '1. Input Ingredients',
    description: "Tell us what's inside your fridge or pantry. Don't worry about exact measurements.",
  },
  {
    icon: AutoAwesomeIcon,
    iconColor: '#F97316',
    iconBg: '#FFF7ED',
    title: '2. Discover Recipes',
    description: 'Our matching engine instantly finds recipes matching your available ingredients.',
  },
  {
    icon: RestaurantIcon,
    iconColor: '#10B981',
    iconBg: '#E6F4EA',
    title: '3. Cook & Save',
    description: 'Follow simple steps to cook, and bookmark your favorites for reducing food waste.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#EFF1FB', borderRadius: 4, px: { xs: 3, md: 6 }, py: { xs: 5, md: 6 }, my: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4, maxWidth: 560, mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, fontSize: { xs: '1.5rem', md: '1.9rem' } }}>
          3 Simple Steps To Reduce Food Waste
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Stop wondering what's for dinner. Turn what you already have into something extraordinary in minutes.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
        }}
      >
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Paper
              key={step.title}
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 3.5,
                textAlign: 'center',
                boxShadow: '0px 4px 16px rgba(15, 23, 42, 0.04)',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: step.iconBg,
                  color: step.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Icon />
              </Box>
              <Typography sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>{step.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {step.description}
              </Typography>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};
