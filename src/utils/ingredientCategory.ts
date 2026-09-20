export type GroceryCategory = 'Produce' | 'Meat & Seafood' | 'Pantry Staples';

const PRODUCE_KEYWORDS = [
  'tomato', 'onion', 'garlic', 'pepper', 'potato', 'carrot', 'lettuce', 'spinach',
  'avocado', 'lemon', 'lime', 'basil', 'parsley', 'coriander', 'cilantro', 'cucumber',
  'mushroom', 'broccoli', 'celery', 'ginger', 'chilli', 'chili', 'apple', 'banana',
  'zucchini', 'courgette', 'cabbage', 'kale', 'scallion', 'spring onion', 'leek', 'herb',
];

const MEAT_SEAFOOD_KEYWORDS = [
  'chicken', 'beef', 'pork', 'lamb', 'turkey', 'bacon', 'sausage', 'salmon', 'tuna',
  'shrimp', 'prawn', 'fish', 'mince', 'steak', 'ham', 'duck', 'crab', 'anchovy', 'cod',
];

export const categorizeIngredient = (name: string): GroceryCategory => {
  const lower = name.toLowerCase();

  if (MEAT_SEAFOOD_KEYWORDS.some((k) => lower.includes(k))) return 'Meat & Seafood';
  if (PRODUCE_KEYWORDS.some((k) => lower.includes(k))) return 'Produce';
  return 'Pantry Staples';
};

export const categoryIcons: Record<GroceryCategory, string> = {
  Produce: '🥬',
  'Meat & Seafood': '🍗',
  'Pantry Staples': '🧂',
};

export const categoryColors: Record<GroceryCategory, string> = {
  Produce: '#10B981',
  'Meat & Seafood': '#E23636',
  'Pantry Staples': '#F97316',
};
