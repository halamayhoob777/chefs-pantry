import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Paper, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddIcon from '@mui/icons-material/Add';

const checklist = ['Smart Ingredient Matching', 'One-Click Grocery Lists', '100% Personalized'];

const useInViewOnce = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
};

export const CTASection: React.FC = () => {
  const { ref, inView } = useInViewOnce();

  return (
    <Box
      ref={ref}
      sx={{
        bgcolor: '#E9F8EF',
        borderRadius: 4,
        p: { xs: 3, md: 6 },
        my: 4,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5,
        overflow: 'hidden',
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes fadeInSide': {
          from: { opacity: 0, transform: 'translateX(28px) rotate(0deg)' },
          to: { opacity: 1, transform: 'translateX(0) rotate(-2deg)' },
        },
        '@keyframes floatCard': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-10px) rotate(-2deg)' },
        },
        '@keyframes popIn': {
          '0%': { opacity: 0, transform: 'scale(0.5)' },
          '60%': { opacity: 1, transform: 'scale(1.15)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        '@keyframes pulseRing': {
          '0%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.45)' },
          '70%': { boxShadow: '0 0 0 8px rgba(16, 185, 129, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '& *': { animation: 'none !important' },
        },
      }}
    >
      <Box sx={{ flex: 1, maxWidth: 480 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            mb: 2,
            fontSize: { xs: '1.6rem', md: '2rem' },
            opacity: 0,
            animation: inView ? 'fadeInUp 0.6s ease forwards' : 'none',
          }}
        >
          Ready to Simplify Your Daily Cooking?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 3,
            opacity: 0,
            animation: inView ? 'fadeInUp 0.6s ease forwards' : 'none',
            animationDelay: '0.1s',
          }}
        >
          Save your favorite pantry recipes, structure your weekly meals, and auto-generate grocery lists
          instantly.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 3 }}>
          {checklist.map((item, i) => (
            <Box
              key={item}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                opacity: 0,
                animation: inView ? 'fadeInUp 0.5s ease forwards' : 'none',
                animationDelay: `${0.2 + i * 0.12}s`,
              }}
            >
              <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          sx={{
            bgcolor: 'secondary.main',
            '&:hover': { bgcolor: '#EA680C', transform: 'translateY(-2px)' },
            borderRadius: 3,
            px: 3.5,
            py: 1.3,
            textTransform: 'none',
            fontWeight: 700,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            opacity: 0,
            animation: inView ? 'fadeInUp 0.5s ease forwards' : 'none',
            animationDelay: '0.6s',
          }}
        >
          Explore Meal Planner
        </Button>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            p: 2.5,
            width: 280,
            opacity: 0,
            transform: 'translateX(28px)',
            animation: inView
              ? 'fadeInSide 0.7s ease forwards, floatCard 4.5s ease-in-out 0.7s infinite'
              : 'none',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar sx={{ width: 36, height: 36 }} src="https://www.themealdb.com/images/media/meals/1529444830.jpg" />
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Weekly Meal Schedule</Typography>
              <Typography variant="caption" color="text.secondary">
                This week's plan
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#E6F4EA',
                borderRadius: 2,
                px: 1.5,
                py: 1,
              }}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: 16,
                  color: 'primary.main',
                  borderRadius: '50%',
                  opacity: 0,
                  animation: inView ? 'popIn 0.4s ease forwards' : 'none',
                  animationDelay: '1s',
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Monday: Salmon Salad
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#F1F0FB',
                borderRadius: 2,
                px: 1.5,
                py: 1,
              }}
            >
              <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Tuesday: Chicken Tacos
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Sync to Calendar
            </Typography>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: 'primary.main',
                animation: inView ? 'pulseRing 2.2s ease-out 1.4s infinite' : 'none',
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </Avatar>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
