import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AllQuestionSet,
  TblMasterMcqAnswer,
  TblMasterMCQQuestion,
} from "../../interface/MCQQuestion";

interface initialStateForMcq {
  mcqQuestionList: TblMasterMCQQuestion[];
  selectedOptions: TblMasterMcqAnswer[];
  allQuestionSet: AllQuestionSet[];
  selectedPackageId: number;
}

const initialState: initialStateForMcq = {
  mcqQuestionList: [],
  selectedOptions: [],
  allQuestionSet: [],
  selectedPackageId: 0
};

const McqSlice = createSlice({
  name: "Detailed",
  initialState,
  reducers: {
    setQuestionList: (state, action: PayloadAction<TblMasterMCQQuestion[]>) => {
      state.mcqQuestionList = action.payload;
    },
    setSelectedOption: (
      state,
      action: PayloadAction<{ option: TblMasterMcqAnswer; IsMultiple: boolean }>
    ) => {
      const { option, IsMultiple } = action.payload;

      const existingIndex = state.selectedOptions.findIndex(
        (opt) => opt.MCQQuestionId === option.MCQQuestionId
      );

      if (existingIndex === -1) {
        state.selectedOptions.push(option);
      } else {
        if (IsMultiple) {
          state.selectedOptions.push(option);
        } else {
          const ans = state.selectedOptions.map((opt, i) => {
            if (i === existingIndex) {
              return option;
            } else {
              return opt;
            }
          });
          state.selectedOptions = ans;
        }
      }
    },
    resetSelectedOptions: (state) => {
      state.selectedOptions = [];
    },

    loadInitialOptions: (
      state,
      action: PayloadAction<TblMasterMcqAnswer[]>
    ) => {
      // console.log("action.payload", action.payload);
      state.selectedOptions = action.payload;
    },

    setAllQuestionSet: (state, action: PayloadAction<AllQuestionSet[]>) => {
      state.allQuestionSet = action.payload;
    },

    setSelectedPackageId: (state, action: PayloadAction<number>) => {
      state.selectedPackageId = action.payload;
    },
  },
});

export const {
  setQuestionList,
  setSelectedOption,
  setAllQuestionSet,
  resetSelectedOptions,
  loadInitialOptions,
  setSelectedPackageId
} = McqSlice.actions;
export default McqSlice.reducer;
