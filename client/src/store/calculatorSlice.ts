// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { useAppDispatch, useAppSelector } from './hooks';


// export interface Material {
//   id: string;
//   name: string;
//   pricePerSqm: number;
//   description: string;
// }

// export const materials: Material[] = [
//   { id: 'paint', name: 'Покраска стен', pricePerSqm: 450, description: 'Качественная покраска с подготовкой поверхности' },
//   { id: 'wallpaper', name: 'Обои премиум', pricePerSqm: 650, description: 'Поклейка обоев премиум класса' },
//   { id: 'laminate', name: 'Ламинат', pricePerSqm: 850, description: 'Укладка ламината 33 класса' },
//   { id: 'parquet', name: 'Паркет', pricePerSqm: 1200, description: 'Укладка паркетной доски' },
//   { id: 'tiles', name: 'Керамическая плитка', pricePerSqm: 950, description: 'Укладка плитки в ванной или кухне' },
//   { id: 'decorative', name: 'Декоративная штукатурка', pricePerSqm: 1100, description: 'Нанесение декоративной штукатурки' },
// ];

// interface CalculatorState {
//   selectedMaterial: string;
//   area: number;
//   totalPrice: number;
// }

// const initialState: CalculatorState = {
//   selectedMaterial: 'paint',
//   area: 0,
//   totalPrice: 0,
// };

//   const dispatch = useAppDispatch();
//     const { categories } = useAppSelector((state) => state.category);
  


// const calculatorSlice = createSlice({
//   name: 'calculator',
//   initialState,
//   reducers: {
//     setMaterial: (state, action: PayloadAction<string>) => {
//       state.selectedMaterial = action.payload;
//       calculatorSlice.caseReducers.calculatePrice(state);
//     },
//     setArea: (state, action: PayloadAction<number>) => {
//       state.area = action.payload;
//       calculatorSlice.caseReducers.calculatePrice(state);
//     },
//     calculatePrice: (state) => {
//       const material = materials.find(m => m.id === state.selectedMaterial);
//       if (material && state.area > 0) {
//         state.totalPrice = material.pricePerSqm * state.area;
//       } else {
//         state.totalPrice = 0;
//       }
//     },
//   },
// });

// export const { setMaterial, setArea } = calculatorSlice.actions;
// export default calculatorSlice.reducer;

// store/calculatorSlice.ts



// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface CalculatorState {
//   selectedMaterialId: number | null;  // теперь number, как у тебя на бэке
//   area: number;
// }

// const initialState: CalculatorState = {
//   selectedMaterialId: null,
//   area: 0,
// };

// export const calculatorSlice = createSlice({
//   name: 'calculator',
//   initialState,
//   reducers: {
//     setMaterial: (state, action: PayloadAction<number>) => {
//       state.selectedMaterialId = action.payload;
//     },
//     setArea: (state, action: PayloadAction<number>) => {
//       state.area = action.payload;
//     },
//     resetCalculator: () => initialState,
//   },
// });

// export const { setMaterial, setArea, resetCalculator } = calculatorSlice.actions;
// export default calculatorSlice.reducer;


import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CalculatorState {
  selectedMaterialId: number | null;
  selectedCategoryId: number | null;  // ← НОВОЕ ПОЛЕ
  area: number;
}

const initialState: CalculatorState = {
  selectedMaterialId: null,
  selectedCategoryId: null,
  area: 0,
};

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setMaterial: (state, action: PayloadAction<number>) => {
      state.selectedMaterialId = action.payload;
    },
    setCategory: (state, action: PayloadAction<number>) => {
      state.selectedCategoryId = action.payload;
      state.selectedMaterialId = null; // сбрасываем материал при смене категории
    },
    setArea: (state, action: PayloadAction<number>) => {
      state.area = action.payload;
    },
    clearCalculator: () => initialState,
  },
});

export const { setMaterial, setCategory, setArea, clearCalculator } = calculatorSlice.actions;
export default calculatorSlice.reducer;