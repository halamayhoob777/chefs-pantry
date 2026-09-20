const hashId = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 100000;
  }
  return hash;
};

export interface EstimatedMeta {
  rating: number;
  reviews: number;
  time: string;
  timeMinutes: number;
  kcal: number;
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
}

export const getEstimatedMeta = (idMeal: string, ingredientCount = 6): EstimatedMeta => {
  const h = hashId(idMeal);

  const rating = 4.3 + (h % 7) / 10; // بين 4.3 و 4.9
  const reviews = 40 + (h % 260); // بين 40 و 300
  const timeMinutes = 15 + (h % 6) * 10; // 15, 25, 35 ... لغاية 65 دقيقة
  const kcal = 320 + (h % 9) * 45; // بين 320 و 680 kcal تقريباً

  const difficulty: EstimatedMeta['difficulty'] =
    ingredientCount <= 6 ? 'Easy' : ingredientCount <= 10 ? 'Intermediate' : 'Advanced';

  return {
    rating: Math.round(rating * 10) / 10,
    reviews,
    time: `${timeMinutes} min`,
    timeMinutes,
    kcal,
    difficulty,
  };
};
