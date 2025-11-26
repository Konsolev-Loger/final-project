import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Material {
  id: string;
  name: string;
  pricePerSqm: number;
  description: string;
}

export const materials: Material[] = [
  { id: 'paint', name: 'Покраска стен', pricePerSqm: 450, description: 'Качественная покраска с подготовкой поверхности' },
  { id: 'wallpaper', name: 'Обои премиум', pricePerSqm: 650, description: 'Поклейка обоев премиум класса' },
  { id: 'laminate', name: 'Ламинат', pricePerSqm: 850, description: 'Укладка ламината 33 класса' },
  { id: 'parquet', name: 'Паркет', pricePerSqm: 1200, description: 'Укладка паркетной доски' },
  { id: 'tiles', name: 'Керамическая плитка', pricePerSqm: 950, description: 'Укладка плитки в ванной или кухне' },
  { id: 'decorative', name: 'Декоративная штукатурка', pricePerSqm: 1100, description: 'Нанесение декоративной штукатурки' },
];

interface CalculatorState {
  selectedMaterial: string;
  area: number;
  totalPrice: number;
}

const initialState: CalculatorState = {
  selectedMaterial: 'paint',
  area: 0,
  totalPrice: 0,
};

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setMaterial: (state, action: PayloadAction<string>) => {
      state.selectedMaterial = action.payload;
      calculatorSlice.caseReducers.calculatePrice(state);
    },
    setArea: (state, action: PayloadAction<number>) => {
      state.area = action.payload;
      calculatorSlice.caseReducers.calculatePrice(state);
    },
    calculatePrice: (state) => {
      const material = materials.find(m => m.id === state.selectedMaterial);
      if (material && state.area > 0) {
        state.totalPrice = material.pricePerSqm * state.area;
      } else {
        state.totalPrice = 0;
      }
    },
  },
});

export const { setMaterial, setArea } = calculatorSlice.actions;
export default calculatorSlice.reducer;
