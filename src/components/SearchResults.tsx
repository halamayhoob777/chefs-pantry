import React from 'react';
import { Box, Typography, Skeleton, Button } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import type { Meal } from '../types/meal';
import { MealResultCard } from './MealResultCard';

interface SearchResultsProps {
  query: string;
  results: Meal[];
  loading: boolean;
  onClear: () => void;
  onSelectMeal?: (mealId: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ query, results, loading, onClear, onSelectMeal }) => {
  return (
    <Box
      sx={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        ml: '-50vw',
        mr: '-50vw',
        bgcolor: '#F7F9FC',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: { xs: 4, md: 5 },
        my: 4,
      }}
    >
      <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {loading ? 'Searching recipes…' : `Results for "${query}"`}
            </Typography>
            {!loading && (
              <Typography variant="body2" color="text.secondary">
                {results.length > 0
                  ? `${results.length} recipe${results.length > 1 ? 's' : ''} found using your ingredients.`
                  : 'No matching recipes — try different ingredients.'}
              </Typography>
            )}
          </Box>
          <Button
            variant="text"
            color="primary"
            onClick={onClear}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Back to suggestions
          </Button>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' },
              gap: 2.5,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i}>
                <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3, mb: 1 }} />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="50%" />
              </Box>
            ))}
          </Box>
        ) : results.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              color: 'text.secondary',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SearchOffIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.6 }} />
            <Typography variant="body2">No recipes matched those ingredients. Try removing one or two.</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' },
              gap: 2.5,
            }}
          >
            {results.map((meal, index) => (
              <MealResultCard key={meal.idMeal} meal={meal} index={index} onSelect={onSelectMeal} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
