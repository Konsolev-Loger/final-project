import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CalculatorState {
  selectedMaterialId: number | null;
  selectedCategoryId: number | null;
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
    
    // ОПЦИЯ 1: Сбросить только выбранный материал (удобно для повторного расчета)
    resetMaterialOnly: (state) => {
      state.selectedMaterialId = null;
    },
    
    // ОПЦИЯ 2: Сбросить материал и площадь, но оставить категорию
    resetAfterAdd: (state) => {
      state.selectedMaterialId = null;
      state.area = 0;
    },
    
    // ОПЦИЯ 3: Сбросить всё, кроме площади (если пользователь часто меняет материалы)
    resetExceptArea: (state) => {
      state.selectedMaterialId = null;
      state.selectedCategoryId = null;
    },
  },
});

// Экспортируйте те экшены, которые вам нужны:
export const { 
  setMaterial, 
  setCategory, 
  setArea, 
  clearCalculator,
  resetMaterialOnly,
  resetAfterAdd,
  resetExceptArea 
} = calculatorSlice.actions;

export default calculatorSlice.reducer;