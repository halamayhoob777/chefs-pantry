import React, { useMemo, useState } from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { suggestedDishes } from '../data/mockDishes';
import { DishCard } from './DishCard';

const filters = ['All Recipes', 'Italian', 'Vegetarian', 'Seafood'] as const;
type Filter = (typeof filters)[number];

interface SuggestedDishesProps {
  onSelectMeal?: (mealId: string) => void;
}

export const SuggestedDishes: React.FC<SuggestedDishesProps> = ({ onSelectMeal }) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('All Recipes');
  const [visibleCount, setVisibleCount] = useState(4);

  const filteredDishes = useMemo(() => {
    if (activeFilter === 'All Recipes') return suggestedDishes;
    return suggestedDishes.filter((d) => d.cuisine === activeFilter);
  }, [activeFilter]);

  return (
    <Box sx={{ my: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Suggested Dishes For You
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Based on your common pantry staples.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onClick={() => setActiveFilter(filter)}
              sx={{
                fontWeight: 600,
                bgcolor: activeFilter === filter ? 'primary.main' : 'transparent',
                color: activeFilter === filter ? '#fff' : 'text.secondary',
                border: '1px solid',
                borderColor: activeFilter === filter ? 'primary.main' : 'divider',
                '&:hover': {
                  bgcolor: activeFilter === filter ? 'primary.main' : 'action.hover',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2.5,
        }}
      >
        {filteredDishes.slice(0, visibleCount).map((dish) => (
          <DishCard key={dish.id} dish={dish} onSelect={onSelectMeal} />
        ))}
      </Box>

      {visibleCount < filteredDishes.length && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setVisibleCount((c) => c + 4)}
            sx={{ borderRadius: 6, textTransform: 'none', fontWeight: 600, px: 4 }}
          >
            Load More Recipes
          </Button>
        </Box>
      )}
    </Box>
  );
};
