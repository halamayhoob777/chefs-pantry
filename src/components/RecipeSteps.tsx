import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { RecipeStep } from '../utils/parseInstructions';

interface RecipeStepsProps {
  steps: RecipeStep[];
}

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
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
};

export const RecipeSteps: React.FC<RecipeStepsProps> = ({ steps }) => {
  const { ref, inView } = useInViewOnce();
  const stepDelay = 0.45; 

  return (
    <Box ref={ref}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: 'text.primary' }}>
        Cooking Instructions
      </Typography>

      <Box
        sx={{
          '@keyframes stepIn': {
            from: { opacity: 0, transform: 'translateX(-16px)' },
            to: { opacity: 1, transform: 'translateX(0)' },
          },
          '@keyframes circlePop': {
            '0%': { opacity: 0, transform: 'scale(0.4)' },
            '70%': { opacity: 1, transform: 'scale(1.15)' },
            '100%': { opacity: 1, transform: 'scale(1)' },
          },
          '@keyframes growLine': {
            from: { transform: 'scaleY(0)' },
            to: { transform: 'scaleY(1)' },
          },
          '@media (prefers-reduced-motion: reduce)': {
            '& *': { animation: 'none !important', opacity: '1 !important' },
          },
        }}
      >
        {steps.map((step, index) => {
          const delay = index * stepDelay;
          const isLast = index === steps.length - 1;

          return (
            <Box key={index} sx={{ display: 'flex', gap: 2.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    minWidth: 32,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    opacity: 0,
                    animation: inView ? 'circlePop 0.4s ease forwards' : 'none',
                    animationDelay: `${delay}s`,
                  }}
                >
                  {index + 1}
                </Box>
                {!isLast && (
                  <Box
                    sx={{
                      width: 2,
                      flexGrow: 1,
                      minHeight: 36,
                      bgcolor: 'divider',
                      transformOrigin: 'top',
                      transform: 'scaleY(0)',
                      animation: inView ? 'growLine 0.4s ease forwards' : 'none',
                      animationDelay: `${delay + 0.25}s`,
                    }}
                  />
                )}
              </Box>

              <Box
                sx={{
                  pb: isLast ? 0 : 3.5,
                  opacity: 0,
                  animation: inView ? 'stepIn 0.5s ease forwards' : 'none',
                  animationDelay: `${delay + 0.05}s`,
                }}
              >
                <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>{step.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {step.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
