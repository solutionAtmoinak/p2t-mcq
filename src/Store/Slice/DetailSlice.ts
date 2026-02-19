import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import MCQPaper from "../../interface/MCQPaper";
import MCQSet from "../../interface/MCQSet";
import { IPackage } from "../../interface/Package";

interface IDetailed {
  selectedExamTypeTab: number;
  selectedMcqSet: MCQSet;
  selectedMcqPaper: MCQPaper;
  examStartTime: string;
  selectedPackage: IPackage | null
}

const initialState: IDetailed = {
  selectedExamTypeTab: 0,
  selectedMcqPaper: {},
  selectedMcqSet: {},
  examStartTime: "",
  selectedPackage: null
};

const DetailedSlice = createSlice({
  name: "Detailed",
  initialState,
  reducers: {
    setExamTypeTab: (state, action: PayloadAction<number>) => {
      state.selectedExamTypeTab = action.payload;
    },
    setSelectedMCQSet: (state, action: PayloadAction<MCQSet>) => {
      state.selectedMcqSet = action.payload;
    },
    setSelectedMCQPaper: (state, action: PayloadAction<MCQPaper>) => {
      state.selectedMcqPaper = action.payload;
    },
    setExamStartTime: (state, action: PayloadAction<string>) => {
      state.examStartTime = action.payload;
    },
    setSelectedPackage: (state, action: PayloadAction<IPackage>) => {
      state.selectedPackage = action.payload
    }
  },
});

export const {
  setExamTypeTab,
  setSelectedMCQSet,
  setSelectedMCQPaper,
  setExamStartTime,
  setSelectedPackage
} = DetailedSlice.actions;
export default DetailedSlice.reducer;
