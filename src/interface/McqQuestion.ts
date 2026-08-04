interface TblMasterMCQQuestion
  extends TblMasterMcqAnswerDescription, TblMasterMCQPassage {
  MCQSetId?: number | string;
  MCQQuestionId?: number | string;
  MCQQuestion?: string;
  MCQQuestionTag?: string;
  MCQQuestionType?: string;
  MCQQuestionTypeId?: string;
  MCQPaperId?: number | string;
  MCQPaperName?: string;
  MCQSectionId?: number | string;
  MCQSectionName?: string;
  MCQQuestionDocumentId?: string;
  MCQQuestionDocumentUrl?: string;
  MCQQuestionUrl?: string;
  IsMultipleCorrect?: boolean;
  MCQOptions?: TblMasterMcqAnswer[];
  // for submitted question
  TblMasterMcqAnswer?: TblMasterMcqAnswer[];
  SpentTime?: number;
  SubmittedOn?: string;
  IsAttempted?: boolean;
}

interface AllQuestionSet extends TblMasterMCQQuestion {
  MCQSetId?: number;
  MCQSetName?: string;
  PackageId?: number;
  ServicesTypeName?: string;
  TblMasterMCQQuestion: TblMasterMCQQuestion[];
}

interface TblMasterMcqAnswer {
  MCQOptionId?: number;
  MCQQuestionId?: number;
  MCQOption?: string;
  IsCorrect?: boolean;
  MCQPartialCorrectMarks?: number;
  MCQPartialNegativeMarks?: number;
  MCQOptionDocumentUrl?: string;
  MCQOptionDocumentId?: number;
  index?: number;
  OneWordAnswer?: string;
  // for submitted question
  IsUserSelected?: boolean;
}

interface TblMasterMcqAnswerDescription {
  AnswerLink?: string;
  Explanation?: string; //for word file
  AnswerExplanation?: string;
  AnswerDocumentId?: string;
  AnswerDocumentUrl?: string;
}

interface TblMasterMCQPassage {
  MCQPassageId?: string;
  PassageDetails?: string;
  PassageLink?: string;
  PassageDocumentId?: string;
  PassageDocumentUrl?: string;
}

export type {
  AllQuestionSet,
  TblMasterMcqAnswer,
  TblMasterMcqAnswerDescription,
  TblMasterMCQPassage,
  TblMasterMCQQuestion,
};
