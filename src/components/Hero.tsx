import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

interface HeroProps {
  onSearch: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [ingredients, setIngredients] = useState<string[]>(['Chicken', 'Tomatoes']);
  const [inputValue, setInputValue] = useState('');

  const handleAddIngredient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!ingredients.includes(inputValue.trim())) {
        const updated = [...ingredients, inputValue.trim()];
        setIngredients(updated);
        onSearch(updated.join(','));
      }
      setInputValue('');
    }
  };

  const handleDelete = (ingredientToDelete: string) => {
    const updated = ingredients.filter((ing) => ing !== ingredientToDelete);
    setIngredients(updated);
    onSearch(updated.join(','));
  };

  const handleSearchClick = () => {
    onSearch(ingredients.join(','));
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 4,
        p: { xs: 3, md: 6 },
        my: 4,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ flex: 1, maxWidth: 580 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 800, mb: 2, color: 'text.primary', fontSize: { xs: '2.2rem', md: '2.8rem' }, lineHeight: 1.2 }}
        >
          Cook Amazing Meals With What You{' '}
          <Box component="span" sx={{ color: 'primary.main' }}>
            Already Have
          </Box>
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.05rem', lineHeight: 1.6 }}>
          Turn your pantry staples into gourmet dishes. Enter your ingredients, and we'll instantly generate
          personalized recipes from top culinary experts.
        </Typography>

        <Paper
          component="div"
          sx={{
            p: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0px 2px 10px rgba(0,0,0,0.02)',
            mb: 3,
          }}
        >
          <SearchIcon sx={{ color: 'primary.main', ml: 1 }} />

          {ingredients.map((ing) => (
            <Chip
              key={ing}
              label={ing}
              onDelete={() => handleDelete(ing)}
              sx={{ bgcolor: '#E6F4EA', color: 'primary.dark', fontWeight: 500, '& .MuiChip-deleteIcon': { color: 'primary.main' } }}
            />
          ))}

          <Box
            component="input"
            type="text"
            placeholder={ingredients.length === 0 ? 'Type ingredient & press enter...' : ''}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddIngredient}
            sx={{
              flex: 1,
              minWidth: 150,
              border: 'none',
              outline: 'none',
              bgcolor: 'transparent',
              fontSize: '0.95rem',
              p: 1,
              color: 'text.primary',
            }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchClick}
            sx={{
              borderRadius: 3,
              px: 3.5,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: '#10B981',
              '&:hover': { bgcolor: '#059669' },
            }}
          >
            Find Recipes
          </Button>
        </Paper>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <Box
          sx={{
            position: 'relative',
            width: 380,
            height: 380,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -14,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #10B981, #F97316, #10B981)',
              opacity: 0.18,
              filter: 'blur(6px)',
              animation: 'spin 14s linear infinite',
            },
            '@keyframes spin': {
              from: { transform: 'rotate(0deg)' },
              to: { transform: 'rotate(360deg)' },
            },
            '@media (prefers-reduced-motion: reduce)': {
              '&::before': { animation: 'none' },
            },
          }}
        >
          <Box
            component="img"
            src="https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg"
            alt="Delicious food"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
              boxShadow: '0px 10px 30px rgba(0,0,0,0.08)',
              position: 'relative',
              animation: 'floatImage 5s ease-in-out infinite',
              '@keyframes floatImage': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-14px)' },
              },
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
              },
            }}
          />

          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: 25,
              left: -20,
              p: '10px 16px',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'background.paper',
              animation: 'floatBadgeA 4.5s ease-in-out infinite',
              '@keyframes floatBadgeA': {
                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                '50%': { transform: 'translateY(-10px) rotate(-2deg)' },
              },
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
              },
            }}
          >
            <Box sx={{ p: 1, bgcolor: '#FFF7ED', borderRadius: 2, display: 'flex', color: '#F97316' }}>
              <AccessTimeIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                Under 30 Mins
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Quick & Easy
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              bottom: 35,
              right: -15,
              p: '10px 16px',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'background.paper',
              animation: 'floatBadgeB 5.5s ease-in-out infinite',
              animationDelay: '0.6s',
              '@keyframes floatBadgeB': {
                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                '50%': { transform: 'translateY(12px) rotate(2deg)' },
              },
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
              },
            }}
          >
            <Box sx={{ p: 1, bgcolor: '#E6F4EA', borderRadius: 2, display: 'flex', color: '#10B981' }}>
              <LocalFloristIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                Pantry Staples
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Zero Waste
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
