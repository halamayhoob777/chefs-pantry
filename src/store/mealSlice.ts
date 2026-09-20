import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { Meal, PlannedMeal } from '../types/meal';

interface MealState {
  favorites: Meal[];
  plannedMeals: PlannedMeal[];
}

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save "${key}" to localStorage:`, error);
  }
};

const initialState: MealState = {
  favorites: loadFromStorage<Meal[]>('chef_favorites', []),
  plannedMeals: loadFromStorage<PlannedMeal[]>('chef_planned_meals', []),
};

export const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Meal>) => {
      const meal = action.payload;
      const exists = state.favorites.some((fav) => fav.idMeal === meal.idMeal);
      
      if (exists) {
        state.favorites = state.favorites.filter((fav) => fav.idMeal !== meal.idMeal);
      } else {
        state.favorites.push(meal);
      }
      saveToStorage('chef_favorites', state.favorites);
    },

    addPlannedMeal: (state, action: PayloadAction<Omit<PlannedMeal, 'id'>>) => {
      const newMeal: PlannedMeal = {
        ...action.payload,
        id: Date.now().toString(), 
      };
      state.plannedMeals.push(newMeal);
      saveToStorage('chef_planned_meals', state.plannedMeals);
    },

    removePlannedMeal: (state, action: PayloadAction<string>) => {
      state.plannedMeals = state.plannedMeals.filter((item) => item.id !== action.payload);
      saveToStorage('chef_planned_meals', state.plannedMeals);
    },

    clearPlannedMeals: (state) => {
      state.plannedMeals = [];
      saveToStorage('chef_planned_meals', state.plannedMeals);
    },
  },
});

export const { toggleFavorite, addPlannedMeal, removePlannedMeal, clearPlannedMeals } = mealSlice.actions;
export default mealSlice.reducer;