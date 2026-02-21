import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IPackage } from "../../interface/Package";
import { InternalService } from "../../interface/InternalService";
import TblMasterMCQSet from "../../interface/MCQSet";
import TblMasterMCQPaper from "../../interface/MCQPaper";

interface IDetailed {
  selectedExamTypeTab: number;
  selectedMcqSet: TblMasterMCQSet;
  selectedMcqPaper: TblMasterMCQPaper;
  examStartTime: string;
  selectedPackage: IPackage | null
  selectedInternalService: InternalService | null
}

const initialState: IDetailed = {
  selectedExamTypeTab: 0,
  selectedMcqPaper: {},
  selectedMcqSet: {},
  examStartTime: "",
  selectedPackage: null,
  selectedInternalService: null
};

const DetailedSlice = createSlice({
  name: "Detailed",
  initialState,
  reducers: {
    setExamTypeTab: (state, action: PayloadAction<number>) => {
      state.selectedExamTypeTab = action.payload;
    },
    setSelectedMCQSet: (state, action: PayloadAction<TblMasterMCQSet>) => {
      state.selectedMcqSet = action.payload;
    },
    setSelectedMCQPaper: (state, action: PayloadAction<TblMasterMCQPaper>) => {
      state.selectedMcqPaper = action.payload;
    },
    setExamStartTime: (state, action: PayloadAction<string>) => {
      state.examStartTime = action.payload;
    },
    setSelectedPackage: (state, action: PayloadAction<IPackage>) => {
      state.selectedPackage = action.payload
    },
    setSelectedInternalService: (state, action: PayloadAction<InternalService>) => {
      state.selectedInternalService = action.payload
    }
  },
});

export const {
  setExamTypeTab,
  setSelectedMCQSet,
  setSelectedMCQPaper,
  setExamStartTime,
  setSelectedPackage,
  setSelectedInternalService
} = DetailedSlice.actions;
export default DetailedSlice.reducer;
