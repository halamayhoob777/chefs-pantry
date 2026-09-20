import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Checkbox,
  Paper,
  Chip,
  Skeleton,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, addPlannedMeal } from '../store/mealSlice';
import type { RootState } from '../store/store';
import type { Meal } from '../types/meal';
import { fetchMealById, fetchMealsByCategory } from '../api/mealApi';
import { parseInstructionSteps } from '../utils/parseInstructions';
import { getEstimatedMeta } from '../utils/mealDisplay';
import { findNextEmptySlot } from '../utils/plannerHelpers';
import { RecipeSteps } from './RecipeSteps';
import { MealResultCard } from './MealResultCard';

interface RecipePageProps {
  mealId: string;
  onBack: () => void;
  onSelectMeal: (mealId: string) => void;
}

const pageX = { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 };

export const RecipePage: React.FC<RecipePageProps> = ({ mealId, onBack, onSelectMeal }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.meals.favorites);
  const plannedMeals = useSelector((state: RootState) => state.meals.plannedMeals);

  const [meal, setMeal] = useState<Meal | null>(null);
  const [related, setRelated] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [addedToPlan, setAddedToPlan] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('Missing ingredients added to your grocery list.');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setAddedToPlan(false);
      setCheckedIngredients({});
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const data = await fetchMealById(mealId);
        if (cancelled) return;
        setMeal(data);

        if (data?.strCategory) {
          const relatedMeals = await fetchMealsByCategory(data.strCategory);
          if (cancelled) return;
          setRelated(relatedMeals.filter((m) => m.idMeal !== mealId).slice(0, 3));
        } else {
          setRelated([]);
        }
      } catch (error) {
        console.error('Failed to load recipe:', error);
        if (!cancelled) setMeal(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [mealId]);

  const isFavorite = meal ? favorites.some((fav) => fav.idMeal === meal.idMeal) : false;
  const meta = meal ? getEstimatedMeta(meal.idMeal, meal.ingredients?.length ?? 6) : null;
  const steps = meal ? parseInstructionSteps(meal.strInstructions || '') : [];

  const handleToggleIngredient = (name: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleAddToGroceryList = () => {
    setSnackbarMessage('Missing ingredients added to your grocery list.');
    setSnackbarOpen(true);
  };

  const handleAddToMealPlan = () => {
    if (!meal) return;

    const slot = findNextEmptySlot(plannedMeals);
    if (!slot) {
      setSnackbarMessage('Your weekly planner is full — clear a slot first.');
      setSnackbarOpen(true);
      return;
    }

    dispatch(
      addPlannedMeal({
        mealId: meal.idMeal,
        title: meal.strMeal,
        image: meal.strMealThumb,
        category: meal.strCategory,
        day: slot.day,
        type: slot.type,
      }),
    );
    setAddedToPlan(true);
  };

  if (loading) {
    return (
      <Box sx={{ px: pageX, py: 4 }}>
        <Skeleton width={160} height={32} sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton width="60%" height={24} sx={{ mb: 2 }} />
            <Skeleton width="80%" height={48} sx={{ mb: 2 }} />
            <Skeleton width="40%" height={24} />
          </Box>
          <Skeleton variant="rounded" sx={{ flex: 1, height: 280, borderRadius: 3 }} />
        </Box>
      </Box>
    );
  }

  if (!meal) {
    return (
      <Box sx={{ px: pageX, py: 8, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Couldn't find this recipe.
        </Typography>
        <Button variant="outlined" onClick={onBack} startIcon={<ArrowBackIcon />}>
          Back to Recipes
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ px: pageX, py: { xs: 2, md: 3 } }}>
      {/* شريط علوي */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box
          onClick={onBack}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          <ArrowBackIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Back to Recipes
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
          Chef's <Box component="span" sx={{ color: 'primary.main' }}>Pantry</Box>
        </Typography>

        <IconButton size="small" sx={{ bgcolor: 'action.hover' }} aria-label="share recipe">
          <ShareIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row' }, gap: 5, mb: 5 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {meal.strArea && (
              <Chip label={`${meal.strArea} Cuisine`} size="small" sx={{ bgcolor: '#E6F4EA', color: 'primary.dark', fontWeight: 600 }} />
            )}
            {meta && <Chip label={`~${meta.time}`} size="small" sx={{ bgcolor: '#FFF7ED', color: '#F97316', fontWeight: 600 }} />}
            {meal.strCategory && (
              <Chip label={meal.strCategory} size="small" sx={{ bgcolor: '#F1F0FB', color: 'text.secondary', fontWeight: 600 }} />
            )}
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
            {meal.strMeal}
          </Typography>

          {meta && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              {Array.from({ length: 5 }).map((_, i) =>
                i < Math.round(meta.rating) ? (
                  <StarIcon key={i} sx={{ fontSize: 20, color: '#F97316' }} />
                ) : (
                  <StarBorderIcon key={i} sx={{ fontSize: 20, color: '#F97316' }} />
                ),
              )}
              <Typography variant="body2" color="text.secondary">
                ({meta.reviews} Reviews)
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              color={isFavorite ? 'error' : 'primary'}
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() => dispatch(toggleFavorite(meal))}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
            >
              {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CalendarMonthIcon />}
              onClick={handleAddToMealPlan}
              disabled={addedToPlan}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
            >
              {addedToPlan ? 'Added to Plan ✓' : 'Add to Meal Plan'}
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', boxShadow: '0px 10px 30px rgba(0,0,0,0.08)' }}>
            <Box component="img" src={meal.strMealThumb} alt={meal.strMeal} sx={{ width: '100%', height: { xs: 240, md: 320 }, objectFit: 'cover', display: 'block' }} />
            {meal.strYoutube && (
              <Box
                component="a"
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(15, 23, 42, 0.15)',
                  transition: 'background-color 0.2s ease-in-out',
                  '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.3)' },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'scale(1.08)' },
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: 34, color: 'primary.main' }} />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 4, mb: 6 }}>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 3, boxShadow: '0px 4px 16px rgba(15, 23, 42, 0.04)', alignSelf: 'start' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
            Ingredients
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {meal.ingredients?.map((ing) => (
              <Box key={ing.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Checkbox
                  checked={!!checkedIngredients[ing.name]}
                  onChange={() => handleToggleIngredient(ing.name)}
                  size="small"
                  sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: checkedIngredients[ing.name] ? 'text.secondary' : 'text.primary',
                    textDecoration: checkedIngredients[ing.name] ? 'line-through' : 'none',
                  }}
                >
                  {ing.measure ? `${ing.measure} ${ing.name}` : ing.name}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToGroceryList}
            sx={{
              mt: 2,
              bgcolor: 'secondary.main',
              '&:hover': { bgcolor: '#EA680C' },
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            Add Missing to Grocery List
          </Button>
        </Paper>

        <RecipeSteps steps={steps} />
      </Box>

      {related.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5, color: 'text.primary' }}>
            You Might Also Like
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
            {related.map((relatedMeal, index) => (
              <MealResultCard key={relatedMeal.idMeal} meal={relatedMeal} index={index} onSelect={onSelectMeal} />
            ))}
          </Box>
        </Box>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={2500} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)} sx={{ borderRadius: 2 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
