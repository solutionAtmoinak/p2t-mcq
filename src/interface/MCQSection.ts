import { TblMasterMCQQuestion } from "./MCQQuestion";

export default interface TblMasterMCQSection {
  MCQSectionId?: number;
  MCQPaperId?: number;
  MCQSectionName?: string;
  SortedOrder?: number;
  MinQuestionAttempt?: number;
  MinQuestionDisplay?: number;
  DefaultNegativeMarks?: number;
  IsRandomizedQuestion?: boolean;
  IsRandomizedOption?: boolean;
  SectionTotalMarks?: number;
  DefaultMarks?: number;
  TblMasterMCQQuestion?: TblMasterMCQQuestion[];
}
