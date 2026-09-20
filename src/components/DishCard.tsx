import React from 'react';
import { Box, Paper, Typography, IconButton, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/mealSlice';
import type { RootState } from '../store/store';
import type { SuggestedDish } from '../data/mockDishes';

const difficultyColors: Record<SuggestedDish['difficulty'], { bg: string; color: string }> = {
  Easy: { bg: '#E6F4EA', color: '#10B981' },
  Intermediate: { bg: '#FFF7ED', color: '#F97316' },
  Advanced: { bg: '#FDECEC', color: '#E23636' },
};

interface DishCardProps {
  dish: SuggestedDish;
  onSelect?: (id: string) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onSelect }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.meals.favorites);
  const difficulty = difficultyColors[dish.difficulty];

  const isFavorite = favorites.some((fav) => fav.idMeal === dish.id);

  const handleToggleFavorite = () => {
    dispatch(
      toggleFavorite({
        idMeal: dish.id,
        strMeal: dish.title,
        strMealThumb: dish.image,
        strCategory: dish.cuisine,
      }),
    );
  };

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
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0px 10px 24px rgba(15, 23, 42, 0.09)' },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={dish.image}
          alt={dish.title}
          onClick={() => onSelect?.(dish.id)}
          sx={{ width: '100%', height: 160, objectFit: 'cover', cursor: 'pointer', display: 'block' }}
        />
        <IconButton
          size="small"
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? 'remove from saved recipes' : 'save recipe'}
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
          {isFavorite ? <BookmarkIcon fontSize="small" color="primary" /> : <BookmarkBorderIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
        </IconButton>
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <StarIcon sx={{ fontSize: 16, color: '#F97316' }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#F97316' }}>
            {dish.rating.toFixed(1)}
          </Typography>
        </Box>

        <Typography
          onClick={() => onSelect?.(dish.id)}
          sx={{
            fontWeight: 700,
            fontSize: '0.95rem',
            color: 'text.primary',
            cursor: 'pointer',
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {dish.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: '0.8rem',
            mb: 1.5,
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {dish.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <AccessTimeIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption">{dish.time}</Typography>
          </Box>
          <Chip
            label={dish.difficulty}
            size="small"
            sx={{
              bgcolor: difficulty.bg,
              color: difficulty.color,
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 22,
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};
