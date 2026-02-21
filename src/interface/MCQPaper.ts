import TblMasterMCQSection from "./MCQSection";

export default interface TblMasterMCQPaper {
  MCQPaperId?: number;
  MCQSetId?: number;
  MCQPaperName?: string;
  PaperType?: string;
  PaperSerialCode?: string;
  SortedOrder?: number;
  IsSample?: boolean;
  MCQStartTime?: string;
  TotalMarks?: number;
  DefaultPositiveMarks?: number;
  DefaultNegativeMarks?: number;
  PaperDuration?: number;
  FromDate?: string;
  ToDate?: string;
  TotalPassMarks?: number;
  Instruction?: string;
  FranchiseId?: number;
  NoOfTotalQuestions?: number;
  MCQPaperEndDate?: string;
  MCQPaperStartDate?: string;
  IsNegativeMark?: boolean;
  MCQWordDocumentId?: number;
  PaperPublishDate?: string;
  ResultPublishDate?: string;
  IsPublished?: boolean;
  IsResultPublished?: boolean;
  IsAnswerSheetShow?: boolean;
  IsActive?: boolean;
  TblMasterMCQSection?: TblMasterMCQSection[]
}
