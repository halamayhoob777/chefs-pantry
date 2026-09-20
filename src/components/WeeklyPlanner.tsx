import React, { useState } from 'react';
import { Box, Typography, Paper, Menu, MenuItem, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useDispatch, useSelector } from 'react-redux';
import { addPlannedMeal, removePlannedMeal } from '../store/mealSlice';
import type { RootState } from '../store/store';
import type { DayOfWeek, PlannedMeal } from '../types/meal';
import { suggestedDishes } from '../data/mockDishes';
import { getEstimatedMeta } from '../utils/mealDisplay';
import { getCurrentWeekDates, formatShortDate, isToday, WEEK_DAYS, MEAL_TYPES } from '../utils/plannerHelpers';

interface WeeklyPlannerProps {
  onSelectMeal: (mealId: string) => void;
}

const MealSlot: React.FC<{
  day: DayOfWeek;
  type: PlannedMeal['type'];
  planned?: PlannedMeal;
  onSelectMeal: (mealId: string) => void;
  label?: string;
}> = ({ day, type, planned, onSelectMeal, label }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePick = (dishId: string) => {
    const dish = suggestedDishes.find((d) => d.id === dishId);
    if (!dish) return;
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
    setAnchorEl(null);
  };

  if (planned) {
    const meta = getEstimatedMeta(planned.mealId);
    return (
      <Box
        sx={{
          bgcolor: '#F8FAFC',
          borderRadius: 2,
          p: 1.5,
          position: 'relative',
          '&:hover .remove-btn': { opacity: 1 },
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>
          {type.toUpperCase()}
        </Typography>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, cursor: 'pointer' }}
          onClick={() => onSelectMeal(planned.mealId)}
        >
          <Box component="img" src={planned.image} alt={planned.title} sx={{ width: 36, height: 36, borderRadius: 1.5, objectFit: 'cover' }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {planned.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <AccessTimeIcon sx={{ fontSize: 12 }} />
              <Typography variant="caption">
                {meta.time} • {meta.kcal} kcal
              </Typography>
            </Box>
          </Box>
        </Box>
        <IconButton
          className="remove-btn"
          size="small"
          onClick={() => dispatch(removePlannedMeal(planned.id))}
          sx={{ position: 'absolute', top: 4, right: 4, opacity: 0, transition: 'opacity 0.15s', width: 20, height: 20 }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>
    );
  }

  return (
    <>
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          border: '1.5px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          minHeight: 68,
          cursor: 'pointer',
          color: 'text.secondary',
          transition: 'border-color 0.15s, color 0.15s',
          '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
        }}
      >
        <AddCircleOutlineIcon sx={{ fontSize: 18 }} />
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Add {label ?? type}
        </Typography>
      </Box>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {suggestedDishes.map((dish) => (
          <MenuItem key={dish.id} onClick={() => handlePick(dish.id)} sx={{ gap: 1.5 }}>
            <Box component="img" src={dish.image} alt={dish.title} sx={{ width: 28, height: 28, borderRadius: 1, objectFit: 'cover' }} />
            {dish.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ onSelectMeal }) => {
  const plannedMeals = useSelector((state: RootState) => state.meals.plannedMeals);
  const weekDates = getCurrentWeekDates();
  const weekdays = WEEK_DAYS.slice(0, 4); 
  const weekend = WEEK_DAYS.slice(4); 

  const getMealsForDay = (day: DayOfWeek) => plannedMeals.filter((m) => m.day === day);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {weekdays.map((day) => {
        const dayMeals = getMealsForDay(day);
        const totalKcal = dayMeals.reduce((sum, m) => sum + getEstimatedMeta(m.mealId).kcal, 0);
        const today = isToday(weekDates[day]);

        return (
          <Paper
            key={day}
            elevation={0}
            sx={{
              borderRadius: 3,
              p: 2.5,
              border: '1.5px solid',
              borderColor: today ? 'primary.main' : 'divider',
              boxShadow: '0px 4px 16px rgba(15, 23, 42, 0.03)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                {today && (
                  <Box sx={{ bgcolor: 'primary.main', color: '#fff', px: 1, py: 0.3, borderRadius: 1.5, fontSize: '0.65rem', fontWeight: 700 }}>
                    TODAY
                  </Box>
                )}
                <Typography sx={{ fontWeight: 700 }}>{day}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatShortDate(weekDates[day])}
                </Typography>
              </Box>
              {dayMeals.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  ● {dayMeals.length} Meal{dayMeals.length > 1 ? 's' : ''} planned
                  {totalKcal > 0 ? ` | ${totalKcal.toLocaleString()} kcal` : ''}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
              {MEAL_TYPES.map((type) => (
                <MealSlot
                  key={type}
                  day={day}
                  type={type}
                  planned={dayMeals.find((m) => m.type === type)}
                  onSelectMeal={onSelectMeal}
                />
              ))}
            </Box>
          </Paper>
        );
      })}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5 }}>
        {weekend.map((day) => {
          const dayMeals = getMealsForDay(day);
          const dinner = dayMeals.find((m) => m.type === 'Dinner');

          return (
            <Paper key={day} elevation={0} sx={{ borderRadius: 3, p: 2, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Typography sx={{ fontWeight: 700 }}>{day}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatShortDate(weekDates[day])}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: dayMeals.length ? 'primary.main' : 'text.secondary', fontWeight: 600 }}>
                  {dayMeals.length} planned
                </Typography>
              </Box>

              {dinner ? (
                <MealSlot day={day} type="Dinner" planned={dinner} onSelectMeal={onSelectMeal} />
              ) : (
                <>
                  <Box sx={{ textAlign: 'center', py: 1, color: 'text.secondary' }}>
                    <RestaurantIcon sx={{ fontSize: 22, opacity: 0.5, mb: 0.5 }} />
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      Plan Weekend Dining
                    </Typography>
                  </Box>
                  <MealSlot day={day} type="Dinner" onSelectMeal={onSelectMeal} label="Dinner" />
                </>
              )}

              {dinner && (
                <Box sx={{ mt: 1.5 }}>
                  <MealSlot day={day} type="Lunch" onSelectMeal={onSelectMeal} label="Meal" />
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};
