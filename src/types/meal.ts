export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  ingredients?: { name: string; measure: string }[];
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface PlannedMeal {
  id: string;
  mealId: string;
  title: string;
  image: string;
  category?: string;
  day: DayOfWeek;
  type: 'Breakfast' | 'Lunch' | 'Dinner';
}