import { useState } from 'react';
import { Box } from '@mui/material';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { SuggestedDishes } from './components/SuggestedDishes';
import { SearchResults } from './components/SearchResults';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { RecipePage } from './components/RecipePage';
import { MealPlannerPage } from './components/MealPlannerPage';
import { SavedRecipesPage } from './components/SavedRecipesPage';
import { fetchMealsByIngredient } from './api/mealApi';
import type { Meal } from './types/meal';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'planner' | 'saved'>('home');
  const favoritesCount = useSelector((state: RootState) => state.meals.favorites.length);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Meal[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setHasSearched(false);
      return;
    }

    setSearchQuery(query);
    setHasSearched(true);
    setIsSearching(true);

    try {
      const primaryIngredient = query.split(',')[0].trim();
      const meals = await fetchMealsByIngredient(primaryIngredient);
      setSearchResults(meals);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setHasSearched(false);
    setSearchResults([]);
  };

  const pageX = { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 };

  const renderTabContent = () => {
    if (activeTab === 'planner') {
      return <MealPlannerPage onSelectMeal={(id) => setSelectedMealId(id)} />;
    }
    if (activeTab === 'saved') {
      return <SavedRecipesPage onSelectMeal={(id) => setSelectedMealId(id)} onExplore={() => setActiveTab('home')} />;
    }
    return (
      <>
        <Box sx={{ px: pageX }}>
          <Hero onSearch={handleSearch} />
        </Box>

        {hasSearched && (
          <SearchResults
            query={searchQuery}
            results={searchResults}
            loading={isSearching}
            onClear={handleClearSearch}
            onSelectMeal={(id) => setSelectedMealId(id)}
          />
        )}

        <Box sx={{ px: pageX }}>
          <HowItWorks />
          <SuggestedDishes onSelectMeal={(id) => setSelectedMealId(id)} />
          <CTASection />
          <Footer />
        </Box>
      </>
    );
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={favoritesCount}
        userName={activeTab !== 'home' ? 'Clara Vance' : undefined}
        userRole="Home Chef"
      />

      {selectedMealId ? (
        <RecipePage
          mealId={selectedMealId}
          onBack={() => setSelectedMealId(null)}
          onSelectMeal={(id) => setSelectedMealId(id)}
        />
      ) : (
        renderTabContent()
      )}
    </Box>
  );
}

export default App;
