import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userSelectedOption: 'dashboard',
};

const userSelectedOptionSlice = createSlice({
  name: 'userSelectedOption',
  initialState,
  reducers: {
    setUserSelectedOption: (state, action) => {
      state.userSelectedOption = action.payload;
    },
  },
});

export const { setUserSelectedOption } = userSelectedOptionSlice.actions;
export const selectUserSelectedOption = (state) => state.userSelectedOption.userSelectedOption;

export default userSelectedOptionSlice.reducer;
