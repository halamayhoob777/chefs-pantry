import type { DayOfWeek, PlannedMeal } from '../types/meal';

export const WEEK_DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const MEAL_TYPES: PlannedMeal['type'][] = ['Breakfast', 'Lunch', 'Dinner'];

export const findNextEmptySlot = (plannedMeals: PlannedMeal[]): { day: DayOfWeek; type: PlannedMeal['type'] } | null => {
  for (const day of WEEK_DAYS) {
    for (const type of MEAL_TYPES) {
      const taken = plannedMeals.some((m) => m.day === day && m.type === type);
      if (!taken) return { day, type };
    }
  }
  return null;
};

export const getCurrentWeekDates = (): Record<DayOfWeek, Date> => {
  const today = new Date();
  const currentDayIndex = (today.getDay() + 6) % 7; // Monday = 0
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDayIndex);

  const result = {} as Record<DayOfWeek, Date>;
  WEEK_DAYS.forEach((day, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    result[day] = d;
  });
  return result;
};

export const formatShortDate = (date: Date): string =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};
