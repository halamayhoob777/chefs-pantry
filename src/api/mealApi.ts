import axios from 'axios';
import type { Meal } from '../types/meal';
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const searchMeals = async (query: string): Promise<Meal[]> => {
  if (!query.trim()) return [];
  const response = await axios.get(`${BASE_URL}/search.php?s=${query}`);
  return response.data.meals || [];
};

export const fetchMealsByIngredient = async (ingredient: string): Promise<Meal[]> => {
  const response = await axios.get(`${BASE_URL}/filter.php?i=${ingredient}`);
  return response.data.meals || [];
};

export const fetchMealById = async (id: string): Promise<Meal | null> => {
  const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
  const rawMeal = response.data.meals?.[0];

  if (!rawMeal) return null;

  const ingredients: { name: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = rawMeal[`strIngredient${i}`];
    const measure = rawMeal[`strMeasure${i}`];
    if (name && name.trim() !== '') {
      ingredients.push({ name: name.trim(), measure: measure ? measure.trim() : '' });
    }
  }

  return {
    ...rawMeal,
    ingredients,
  };
};

export const fetchMealsByCategory = async (category: string): Promise<Meal[]> => {
  if (!category) return [];
  const response = await axios.get(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  return response.data.meals || [];
};