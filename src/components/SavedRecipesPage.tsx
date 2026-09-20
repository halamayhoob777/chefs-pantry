import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  InputBase,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExploreIcon from '@mui/icons-material/Explore';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, addPlannedMeal } from '../store/mealSlice';
import type { RootState } from '../store/store';
import type { Meal } from '../types/meal';
import { getEstimatedMeta } from '../utils/mealDisplay';
import { findNextEmptySlot } from '../utils/plannerHelpers';

interface SavedRecipesPageProps {
  onSelectMeal: (mealId: string) => void;
  onExplore: () => void;
}

const SavedRecipeCard: React.FC<{ meal: Meal; view: 'grid' | 'list'; onSelectMeal: (id: string) => void }> = ({
  meal,
  view,
  onSelectMeal,
}) => {
  const dispatch = useDispatch();
  const plannedMeals = useSelector((state: RootState) => state.meals.plannedMeals);
  const [snackbar, setSnackbar] = useState(false);
  const meta = getEstimatedMeta(meal.idMeal, meal.ingredients?.length ?? 6);

  const handleAddToPlan = () => {
    const slot = findNextEmptySlot(plannedMeals);
    if (!slot) return;
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
    setSnackbar(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: view === 'grid' ? 'column' : 'row',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0px 4px 16px rgba(15, 23, 42, 0.04)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0px 10px 24px rgba(15, 23, 42, 0.09)' },
      }}
    >
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Box
          component="img"
          src={meal.strMealThumb}
          alt={meal.strMeal}
          onClick={() => onSelectMeal(meal.idMeal)}
          sx={{ width: view === 'grid' ? '100%' : 140, height: view === 'grid' ? 160 : '100%', objectFit: 'cover', cursor: 'pointer', display: 'block' }}
        />
        {meal.strCategory && (
          <Chip label={meal.strCategory} size="small" sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'rgba(255,255,255,0.92)', fontWeight: 600, fontSize: '0.65rem' }} />
        )}
        <IconButton
          size="small"
          onClick={() => dispatch(toggleFavorite(meal))}
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.92)', width: 28, height: 28 }}
        >
          <FavoriteIcon fontSize="small" color="error" />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1, bgcolor: 'background.paper' }}>
        <Typography onClick={() => onSelectMeal(meal.idMeal)} sx={{ fontWeight: 700, cursor: 'pointer', mb: 0.5 }}>
          {meal.strMeal}
        </Typography>
        {meal.strArea && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, flexGrow: view === 'list' ? 1 : 0 }}>
            {meal.strArea} Cuisine
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary', mb: 1.5 }}>
          <Typography variant="caption">{meta.time}</Typography>
          <Typography variant="caption">•</Typography>
          <Typography variant="caption">{meta.kcal} kcal</Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<CalendarMonthIcon />}
          onClick={handleAddToPlan}
          sx={{ alignSelf: 'flex-start', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Add to Meal Plan
        </Button>
      </Box>

      <Snackbar open={snackbar} autoHideDuration={2000} onClose={() => setSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
          Added to your meal plan.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export const SavedRecipesPage: React.FC<SavedRecipesPageProps> = ({ onSelectMeal, onExplore }) => {
  const favorites = useSelector((state: RootState) => state.meals.favorites);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    favorites.forEach((m) => {
      const cat = m.strCategory || 'Other';
      counts.set(cat, (counts.get(cat) || 0) + 1);
    });
    return Array.from(counts.entries());
  }, [favorites]);

  const filtered = useMemo(() => {
    let list = [...favorites];
    if (activeCategory !== 'All') list = list.filter((m) => (m.strCategory || 'Other') === activeCategory);
    if (search.trim()) list = list.filter((m) => m.strMeal.toLowerCase().includes(search.trim().toLowerCase()));
    if (sortBy === 'recent') list = list.slice().reverse();
    else list = list.slice().sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    return list;
  }, [favorites, activeCategory, search, sortBy]);

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 }, py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Saved Recipes
            </Typography>
            <Chip label={`${favorites.length} Saved Items`} size="small" sx={{ bgcolor: '#E6F4EA', color: 'primary.dark', fontWeight: 700 }} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Quickly access your handpicked culinary favorites, organize personalized collections, or schedule them
            seamlessly into your weekly kitchen plan.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<CollectionsBookmarkIcon />}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            Plan All Meals
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: '#EA680C' }, borderRadius: 3, textTransform: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            Create New Collection
          </Button>
        </Box>
      </Box>

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <FavoriteIcon sx={{ fontSize: 40, opacity: 0.4, mb: 1 }} />
          <Typography sx={{ mb: 2 }}>You haven't saved any recipes yet.</Typography>
          <Button variant="contained" color="primary" onClick={onExplore} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }}>
            Explore Recipes
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F1F0FB', borderRadius: 3, px: 2, flexGrow: 1 }}>
              <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <InputBase
                placeholder="Search saved recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ flex: 1, py: 1, px: 1, fontSize: '0.9rem' }}
              />
            </Box>
            <Select
              size="small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'name')}
              sx={{ borderRadius: 3, minWidth: 160 }}
            >
              <MenuItem value="recent">Recently Added</MenuItem>
              <MenuItem value="name">Name (A-Z)</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton onClick={() => setView('grid')} sx={{ bgcolor: view === 'grid' ? 'primary.main' : 'action.hover', color: view === 'grid' ? '#fff' : 'text.secondary' }}>
                <GridViewIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setView('list')} sx={{ bgcolor: view === 'list' ? 'primary.main' : 'action.hover', color: view === 'list' ? '#fff' : 'text.secondary' }}>
                <ViewListIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            <Chip
              label={`All (${favorites.length})`}
              onClick={() => setActiveCategory('All')}
              sx={{
                fontWeight: 600,
                bgcolor: activeCategory === 'All' ? 'primary.main' : 'transparent',
                color: activeCategory === 'All' ? '#fff' : 'text.secondary',
                border: '1px solid',
                borderColor: activeCategory === 'All' ? 'primary.main' : 'divider',
              }}
            />
            {categories.map(([cat, count]) => (
              <Chip
                key={cat}
                label={`${cat} (${count})`}
                onClick={() => setActiveCategory(cat)}
                sx={{
                  fontWeight: 600,
                  bgcolor: activeCategory === cat ? 'primary.main' : 'transparent',
                  color: activeCategory === cat ? '#fff' : 'text.secondary',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'primary.main' : 'divider',
                }}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: view === 'grid' ? { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } : '1fr',
              gap: 2.5,
              mb: 5,
            }}
          >
            {filtered.map((meal) => (
              <SavedRecipeCard key={meal.idMeal} meal={meal} view={view} onSelectMeal={onSelectMeal} />
            ))}
          </Box>
        </>
      )}

      <Box
        sx={{
          bgcolor: '#F1F0FB',
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ExploreIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography sx={{ fontWeight: 700 }}>Looking for something new to cook?</Typography>
            <Typography variant="body2" color="text.secondary">
              Explore hundreds of chef-curated seasonal dishes and quick pantry staples.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          onClick={onExplore}
          sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: '#EA680C' }, borderRadius: 3, textTransform: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}
        >
          Explore Trending Recipes
        </Button>
      </Box>
    </Box>
  );
};
