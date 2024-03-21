
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedOption: '',
};

const selectedOptionSlice = createSlice({
  name: 'selectedOption',
  initialState,
  reducers: {
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
  },
});
//SA
export const { setSelectedOption } = selectedOptionSlice.actions;
export const selectSelectedOption = (state) => state.selectedOption.selectedOption;
export default selectedOptionSlice.reducer;
