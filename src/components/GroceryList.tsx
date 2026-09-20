import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  Chip,
  Button,
  LinearProgress,
  Skeleton,
  Snackbar,
  Alert,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { fetchMealById } from '../api/mealApi';
import { categorizeIngredient, categoryIcons, type GroceryCategory } from '../utils/ingredientCategory';

interface GroceryItem {
  name: string;
  measures: string[];
  mealTitles: string[];
  days: string[];
  category: GroceryCategory;
}

const CATEGORY_ORDER: GroceryCategory[] = ['Produce', 'Meat & Seafood', 'Pantry Staples'];

export const GroceryList: React.FC = () => {
  const plannedMeals = useSelector((state: RootState) => state.meals.plannedMeals);
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const uniqueMealIds = useMemo(() => Array.from(new Set(plannedMeals.map((m) => m.mealId))), [plannedMeals]);

  useEffect(() => {
    let cancelled = false;

    const build = async () => {
      if (uniqueMealIds.length === 0) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const fullMeals = await Promise.all(uniqueMealIds.map((id) => fetchMealById(id)));
        if (cancelled) return;

        const map = new Map<string, GroceryItem>();
        fullMeals.forEach((meal) => {
          if (!meal) return;
          const daysForMeal = plannedMeals.filter((m) => m.mealId === meal.idMeal).map((m) => m.day);

          meal.ingredients?.forEach((ing) => {
            const key = ing.name.toLowerCase();
            const existing = map.get(key);
            if (existing) {
              if (!existing.mealTitles.includes(meal.strMeal)) existing.mealTitles.push(meal.strMeal);
              existing.measures.push(ing.measure);
              daysForMeal.forEach((d) => {
                if (!existing.days.includes(d)) existing.days.push(d);
              });
            } else {
              map.set(key, {
                name: ing.name,
                measures: [ing.measure],
                mealTitles: [meal.strMeal],
                days: [...new Set(daysForMeal)],
                category: categorizeIngredient(ing.name),
              });
            }
          });
        });

        setItems(Array.from(map.values()));
      } catch (error) {
        console.error('Failed to build grocery list:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    build();
    return () => {
      cancelled = true;
    };
  }, [uniqueMealIds.join(',')]);

  const grouped = useMemo(() => {
    const g: Record<GroceryCategory, GroceryItem[]> = { Produce: [], 'Meat & Seafood': [], 'Pantry Staples': [] };
    items.forEach((item) => g[item.category].push(item));
    return g;
  }, [items]);

  const totalItems = items.length;
  const checkedCount = items.filter((i) => checked[i.name.toLowerCase()]).length;
  const progress = totalItems ? (checkedCount / totalItems) * 100 : 0;
  const completeCategories = CATEGORY_ORDER.filter(
    (cat) => grouped[cat].length > 0 && grouped[cat].every((i) => checked[i.name.toLowerCase()]),
  ).length;
  const nonEmptyCategories = CATEGORY_ORDER.filter((cat) => grouped[cat].length > 0).length;

  const overlapTip = useMemo(() => {
    const overlapping = items.find((i) => i.days.length >= 2);
    if (!overlapping) return null;
    return `You have overlapping ingredients (${overlapping.name}) across ${overlapping.days.slice(0, 2).join(' and ')} to help minimize food waste.`;
  }, [items]);

  const toggleItem = (name: string) => {
    setChecked((prev) => ({ ...prev, [name.toLowerCase()]: !prev[name.toLowerCase()] }));
  };

  const handleCopy = () => {
    const text = CATEGORY_ORDER.filter((cat) => grouped[cat].length > 0)
      .map((cat) => `${cat}:\n${grouped[cat].map((i) => `- ${i.measures[0] ? `${i.measures[0]} ` : ''}${i.name}`).join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(text).then(() => setSnackbar('Grocery list copied to clipboard.'));
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, p: 3, boxShadow: '0px 4px 16px rgba(15, 23, 42, 0.04)', position: 'sticky', top: 90 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartIcon color="primary" />
          <Typography sx={{ fontWeight: 800 }}>Smart Grocery List</Typography>
        </Box>
        <Chip label={`${totalItems} items`} size="small" sx={{ bgcolor: '#E6F4EA', color: 'primary.dark', fontWeight: 700 }} />
      </Box>
      <Typography variant="caption" color="text.secondary">
        Auto-synced from {uniqueMealIds.length} weekly recipe{uniqueMealIds.length === 1 ? '' : 's'}
      </Typography>

      {loading ? (
        <Box sx={{ mt: 2 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={32} sx={{ my: 0.5 }} />
          ))}
        </Box>
      ) : totalItems === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Add meals to your planner to generate a grocery list automatically.
        </Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2.5, mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Items Purchased
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {completeCategories} of {nonEmptyCategories} categories complete
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 6, borderRadius: 3, mb: 2.5, bgcolor: '#E9ECF3', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
          />

          {CATEGORY_ORDER.filter((cat) => grouped[cat].length > 0).map((cat) => (
            <Box key={cat} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  {categoryIcons[cat]} {cat.toUpperCase()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {grouped[cat].length} items
                </Typography>
              </Box>
              {grouped[cat].map((item) => {
                const isChecked = !!checked[item.name.toLowerCase()];
                return (
                  <Box
                    key={item.name}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: isChecked ? '#F0FBF4' : 'transparent',
                      borderRadius: 2,
                      px: 0.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        onChange={() => toggleItem(item.name)}
                        sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: isChecked ? 'line-through' : 'none',
                          color: isChecked ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {item.measures[0] ? `${item.measures[0]} ` : ''}
                        {item.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={item.mealTitles.length > 1 ? 'Multiple' : item.mealTitles[0]}
                      size="small"
                      sx={{ bgcolor: '#F1F0FB', color: 'text.secondary', fontSize: '0.65rem', height: 20, maxWidth: 90 }}
                    />
                  </Box>
                );
              })}
            </Box>
          ))}

          <Button
            fullWidth
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: '#EA680C' }, borderRadius: 2.5, textTransform: 'none', fontWeight: 700, mb: 1 }}
          >
            Export / Print List
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
          >
            Copy to Clipboard
          </Button>

          {overlapTip && (
            <Box sx={{ display: 'flex', gap: 1, bgcolor: '#F0FBF4', borderRadius: 2, p: 1.5, mt: 2.5 }}>
              <LightbulbIcon sx={{ fontSize: 18, color: 'primary.main', mt: 0.2 }} />
              <Typography variant="caption" color="text.secondary">
                <b>Zero Waste Tip:</b> {overlapTip}
              </Typography>
            </Box>
          )}
        </>
      )}

      <Snackbar open={!!snackbar} autoHideDuration={2500} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar}
        </Alert>
      </Snackbar>
    </Paper>
  );
};
