import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/mealSlice';
import type { RootState } from '../store/store';
import type { Meal } from '../types/meal';

interface MealResultCardProps {
  meal: Meal;
  index?: number;
  onSelect?: (mealId: string) => void;
}

export const MealResultCard: React.FC<MealResultCardProps> = ({ meal, index = 0, onSelect }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.meals.favorites);
  const isFavorite = favorites.some((fav) => fav.idMeal === meal.idMeal);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: '0px 4px 16px rgba(15, 23, 42, 0.04)',
        opacity: 0,
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(18px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: 'fadeInUp 0.5s ease forwards',
        animationDelay: `${Math.min(index, 10) * 70}ms`,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0px 10px 24px rgba(15, 23, 42, 0.09)' },
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          opacity: 1,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={meal.strMealThumb}
          alt={meal.strMeal}
          onClick={() => onSelect?.(meal.idMeal)}
          sx={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', cursor: onSelect ? 'pointer' : 'default' }}
        />
        <IconButton
          size="small"
          onClick={() => dispatch(toggleFavorite(meal))}
          aria-label="add to favorites"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'rgba(255,255,255,0.9)',
            width: 30,
            height: 30,
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon fontSize="small" color="error" />
          ) : (
            <FavoriteBorderIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          )}
        </IconButton>
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography
          onClick={() => onSelect?.(meal.idMeal)}
          sx={{
            fontWeight: 700,
            fontSize: '0.95rem',
            color: 'text.primary',
            mb: 0.5,
            cursor: onSelect ? 'pointer' : 'default',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {meal.strMeal}
        </Typography>
        {meal.strCategory && (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            {meal.strCategory}
            {meal.strArea ? ` • ${meal.strArea} Cuisine` : ''}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
