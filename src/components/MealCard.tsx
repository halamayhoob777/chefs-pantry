import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, IconButton, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/mealSlice';
import type { RootState } from '../store/store';
import type { Meal } from '../types/meal';

interface MealCardProps {
  meal: Meal;
  onSelectMeal?: (mealId: string) => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onSelectMeal }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.meals.favorites);

  const isFavorite = favorites.some((fav) => fav.idMeal === meal.idMeal);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={meal.strMealThumb}
        alt={meal.strMeal}
        sx={{ cursor: 'pointer' }}
        onClick={() => onSelectMeal?.(meal.idMeal)}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        {meal.strCategory && (
          <Chip label={meal.strCategory} size="small" color="primary" variant="outlined" sx={{ mb: 1 }} />
        )}
        <Typography
          variant="h6"
          component="div"
          onClick={() => onSelectMeal?.(meal.idMeal)}
          sx={{
            fontWeight: 600,
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {meal.strMeal}
        </Typography>
        {meal.strArea && (
          <Typography variant="body2" color="text.secondary">
            {meal.strArea} Cuisine
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <IconButton
          color="error"
          onClick={() => dispatch(toggleFavorite(meal))}
          aria-label="add to favorites"
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
};
