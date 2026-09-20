export interface SuggestedDish {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  time: string;
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
  cuisine: string;
}

export const suggestedDishes: SuggestedDish[] = [
  {
    id: '52777',
    title: 'Mediterranean Pasta Salad',
    description: 'A fresh, chilled pasta salad with mozzarella, olives, tuna, and basil.',
    image: 'https://www.themealdb.com/images/media/meals/wvqpwt1468339226.jpg',
    rating: 4.8,
    time: '30min',
    difficulty: 'Easy',
    cuisine: 'Italian',
  },
  {
    id: '52771',
    title: 'Spicy Arrabiata Penne',
    description: 'A vegetarian pasta tossed in a fiery tomato and chilli sauce.',
    image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
    rating: 4.7,
    time: '25min',
    difficulty: 'Easy',
    cuisine: 'Vegetarian',
  },
  {
    id: '52945',
    title: 'Kung Pao Chicken',
    description: 'Stir-fried chicken in a bold, spicy-sweet sauce with peanuts and spring onions.',
    image: 'https://www.themealdb.com/images/media/meals/1525872624.jpg',
    rating: 4.6,
    time: '35min',
    difficulty: 'Intermediate',
    cuisine: 'Asian',
  },
  {
    id: '52960',
    title: 'Salmon Avocado Salad',
    description: 'Pan-seared salmon on a bed of greens with creamy avocado.',
    image: 'https://www.themealdb.com/images/media/meals/1549542994.jpg',
    rating: 4.9,
    time: '20min',
    difficulty: 'Easy',
    cuisine: 'Seafood',
  },
];
