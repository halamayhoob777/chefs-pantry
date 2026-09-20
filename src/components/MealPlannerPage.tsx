import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useDispatch, useSelector } from 'react-redux';
import { addPlannedMeal, clearPlannedMeals } from '../store/mealSlice';
import type { RootState } from '../store/store';
import { WeeklyPlanner } from './WeeklyPlanner';
import { GroceryList } from './GroceryList';
import { suggestedDishes } from '../data/mockDishes';
import { WEEK_DAYS, MEAL_TYPES, getCurrentWeekDates, formatShortDate } from '../utils/plannerHelpers';

interface MealPlannerPageProps {
  onSelectMeal: (mealId: string) => void;
}

export const MealPlannerPage: React.FC<MealPlannerPageProps> = ({ onSelectMeal }) => {
  const dispatch = useDispatch();
  const plannedMeals = useSelector((state: RootState) => state.meals.plannedMeals);
  const weekDates = getCurrentWeekDates();
  const weekLabel = `Week of ${formatShortDate(weekDates.Monday)} – ${formatShortDate(weekDates.Sunday)}`;

  const handleAutoFill = () => {
    let dishIndex = 0;
    WEEK_DAYS.forEach((day) => {
      MEAL_TYPES.forEach((type) => {
        const taken = plannedMeals.some((m) => m.day === day && m.type === type);
        if (!taken) {
          const dish = suggestedDishes[dishIndex % suggestedDishes.length];
          dishIndex += 1;
          dispatch(
            addPlannedMeal({
              mealId: dish.id,
              title: dish.title,
              image: dish.image,
              category: dish.cuisine,
              day,
              type,
            }),
          );
        }
      });
    });
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 }, py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Weekly Meal Planner
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organize your meals for the week and auto-generate your grocery list.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ px: 2, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 3, fontSize: '0.85rem', fontWeight: 600 }}>
            {weekLabel}
          </Box>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<DeleteSweepIcon />}
            onClick={() => dispatch(clearPlannedMeals())}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Clear Week
          </Button>
          <Button
            variant="contained"
            startIcon={<AutoFixHighIcon />}
            onClick={handleAutoFill}
            sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: '#EA680C' }, borderRadius: 3, textTransform: 'none', fontWeight: 700 }}
          >
            Auto-Fill Ideas
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 3, alignItems: 'start' }}>
        <WeeklyPlanner onSelectMeal={onSelectMeal} />
        <GroceryList />
      </Box>
    </Box>
  );
};
