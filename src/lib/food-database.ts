export interface MealIngredientItem {
  id: string;
  name: string;
  category: "protein" | "carbs" | "fats" | "veggies" | "fruits" | "dairy";
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  calPer100g: number;
  pPer100g: number;
  cPer100g: number;
  fPer100g: number;
  fiberPer100g: number;
}

export interface CommonFoodItem {
  name: string;
  category: "protein" | "carbs" | "fats" | "veggies" | "fruits" | "dairy";
  calPer100g: number;
  pPer100g: number;
  cPer100g: number;
  fPer100g: number;
  fiberPer100g: number;
}

export const COMMON_FOODS_DATABASE: CommonFoodItem[] = [
  {
    name: "Pancakes Stack",
    category: "carbs",
    calPer100g: 297,
    pPer100g: 5.0,
    cPer100g: 41.0,
    fPer100g: 9.5,
    fiberPer100g: 1.5,
  },
  {
    name: "Fresh Blueberries",
    category: "fruits",
    calPer100g: 57,
    pPer100g: 0.7,
    cPer100g: 14.5,
    fPer100g: 0.3,
    fiberPer100g: 2.4,
  },
  {
    name: "Maple Syrup",
    category: "carbs",
    calPer100g: 260,
    pPer100g: 0.0,
    cPer100g: 67.0,
    fPer100g: 0.0,
    fiberPer100g: 0.0,
  },
  {
    name: "Salmon Fillet",
    category: "protein",
    calPer100g: 208,
    pPer100g: 22.0,
    cPer100g: 0.0,
    fPer100g: 13.0,
    fiberPer100g: 0.0,
  },
  {
    name: "Broccoli Florets",
    category: "veggies",
    calPer100g: 35,
    pPer100g: 2.8,
    cPer100g: 7.0,
    fPer100g: 0.4,
    fiberPer100g: 2.6,
  },
  {
    name: "Seasoning & Olive Oil",
    category: "fats",
    calPer100g: 884,
    pPer100g: 0.0,
    cPer100g: 0.0,
    fPer100g: 100.0,
    fiberPer100g: 0.0,
  },
  {
    name: "Spring Onions",
    category: "veggies",
    calPer100g: 32,
    pPer100g: 1.8,
    cPer100g: 7.3,
    fPer100g: 0.2,
    fiberPer100g: 2.6,
  },
  {
    name: "Grilled Chicken Breast",
    category: "protein",
    calPer100g: 150,
    pPer100g: 31.0,
    cPer100g: 0.0,
    fPer100g: 2.5,
    fiberPer100g: 0.0,
  },
  {
    name: "Sweet Potato",
    category: "carbs",
    calPer100g: 104,
    pPer100g: 1.8,
    cPer100g: 24.0,
    fPer100g: 0.2,
    fiberPer100g: 3.2,
  },
  {
    name: "Fresh Avocado",
    category: "fats",
    calPer100g: 160,
    pPer100g: 2.0,
    cPer100g: 8.5,
    fPer100g: 14.7,
    fiberPer100g: 6.7,
  },
  {
    name: "Cooked White Rice",
    category: "carbs",
    calPer100g: 130,
    pPer100g: 2.7,
    cPer100g: 28.0,
    fPer100g: 0.3,
    fiberPer100g: 1.8,
  },
  {
    name: "Whole Eggs",
    category: "protein",
    calPer100g: 143,
    pPer100g: 12.6,
    cPer100g: 0.8,
    fPer100g: 9.6,
    fiberPer100g: 0.0,
  },
  {
    name: "Rolled Oats",
    category: "carbs",
    calPer100g: 375,
    pPer100g: 13.5,
    cPer100g: 66.0,
    fPer100g: 6.8,
    fiberPer100g: 10.0,
  },
  {
    name: "Greek Yogurt 0%",
    category: "dairy",
    calPer100g: 59,
    pPer100g: 10.0,
    cPer100g: 3.6,
    fPer100g: 0.4,
    fiberPer100g: 0.0,
  },
  {
    name: "Ground Beef 90/10",
    category: "protein",
    calPer100g: 176,
    pPer100g: 20.0,
    cPer100g: 0.0,
    fPer100g: 10.0,
    fiberPer100g: 0.0,
  },
  {
    name: "Spinach",
    category: "veggies",
    calPer100g: 23,
    pPer100g: 2.9,
    cPer100g: 3.6,
    fPer100g: 0.4,
    fiberPer100g: 2.2,
  },
  {
    name: "Banana",
    category: "fruits",
    calPer100g: 89,
    pPer100g: 1.1,
    cPer100g: 22.8,
    fPer100g: 0.3,
    fiberPer100g: 2.6,
  },
  {
    name: "Almonds",
    category: "fats",
    calPer100g: 579,
    pPer100g: 21.0,
    cPer100g: 21.6,
    fPer100g: 49.9,
    fiberPer100g: 12.5,
  },
];
