import TblMasterMCQPaper from "./MCQPaper";

export default interface TblMasterMCQSet {
  MCQSetId?: number;
  PackageId?: number;
  FranchiseId?: number;
  MCQSetName?: string;
  MCQSetNegativeMark?: boolean;
  MCQQuestionRandom?: boolean;
  SortedOrder?: number;
  IsFree?: boolean;
  DocumentId?: number;
  IsActive?: boolean;
  CreatedBy?: string;
  ModifiedBy?: string;
  CreatedOn?: string;
  ModifiedOn?: string;
  CreatedIP?: string;
  ModifiedIp?: string;
  IsDeleted?: boolean;
  TotalMarks?: number;
  MCQDuration?: number;
  MCQFromDate?: string;
  MCQUptoDate?: string;
  IsLive?: boolean;
  LiveFromTime?: string;
  InternelServiceId?: number;
  TblMasterMCQPaper?: TblMasterMCQPaper[]
}
