import {
  IoAttachOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoDocumentTextOutline,
  IoOpenOutline,
  IoSparklesOutline,
  IoTimeOutline,
} from "react-icons/io5";
import MathMLComp from "../../Helper/MathMlComp";
import { TblMasterMCQQuestion } from "../../interface/MCQQuestion";
import "../../styles/submitted-answers-modal.css";
import ModalComp2 from "../Common/ModalComp2";

interface Props {
  submittedAnsList: TblMasterMCQQuestion[];
  onClose: () => void;
  open: boolean;
}

const SubmittedAnswersModal = ({ submittedAnsList, onClose, open }: Props) => {
  return (
    <ModalComp2
      title="Submitted answer review"
      open={open}
      onClose={onClose}
      size="lg"
      overflow={false}
      backdrop="static"
      keyboard
      className="submitted-answers-modal"
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
              Detailed feedback
            </p>
            <h2 className="mt-0.5 text-lg font-bold text-secondary sm:text-xl">
              Question review
            </h2>
            <p className="mt-0.5 hidden text-xs text-slate-500 sm:block sm:text-sm">
              Review your submitted responses and the correct answers.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl bg-[#EEF6FD] px-3 py-2 text-xs font-semibold text-secondary sm:text-sm">
            <IoDocumentTextOutline className="text-lg text-primary" />
            {submittedAnsList.length} question
            {submittedAnsList.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-2.5 sm:p-4">
          {submittedAnsList.map((question, questionIndex) => (
            <article
              key={question.MCQQuestionId ?? questionIndex}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-bold text-primary ring-1 ring-orange-100">
                    {questionIndex + 1}
                  </span>

                  <div className="min-w-0 flex-1 pt-1 text-sm font-semibold leading-6 text-secondary sm:text-base">
                    <MathMLComp data={String(question.MCQQuestion ?? "")} />

                    {!!question.MCQQuestionDocumentUrl &&
                      question.MCQQuestionDocumentUrl !== "0" && (
                        <a
                          href={question.MCQQuestionDocumentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 block w-fit max-w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 transition hover:border-primary focus:outline-none focus:ring-4 focus:ring-orange-100"
                          aria-label={`Open reference image for question ${questionIndex + 1}`}
                        >
                          <img
                            src={question.MCQQuestionDocumentUrl}
                            alt={`Reference for question ${questionIndex + 1}`}
                            className="max-h-64 max-w-full rounded-lg object-contain"
                            loading="lazy"
                          />
                        </a>
                      )}
                  </div>

                  {question.SpentTime != null && (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 sm:px-3 sm:text-xs">
                      <IoTimeOutline className="text-sm text-primary" />
                      {question.SpentTime}s
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 p-3 sm:p-4">
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {(question.TblMasterMcqAnswer ?? []).map(
                    (answer, answerIndex) => (
                      <div
                        key={answer.MCQOptionId ?? answerIndex}
                        className={`rounded-xl border p-3.5 sm:p-4 ${answer.IsCorrect
                          ? "border-green-200 bg-green-50/70"
                          : answer.IsUserSelected
                            ? "border-red-200 bg-red-50/70"
                            : "border-slate-200 bg-white"
                          }`}
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${answer.IsCorrect
                              ? "bg-green-100 text-green-700"
                              : answer.IsUserSelected
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-600"
                              }`}
                          >
                            {String.fromCharCode(65 + answerIndex)}
                          </span>

                          <div className="min-w-0 flex-1 break-words text-sm font-normal leading-6 text-slate-700">
                            <MathMLComp
                              data={String(
                                answer.OneWordAnswer ?? answer.MCQOption ?? "",
                              )}
                            />
                          </div>
                        </div>

                        {(answer.IsUserSelected || answer.IsCorrect) && (
                          <div className="mt-3 flex flex-wrap gap-2 border-t border-current/10 pt-3">
                            {answer.IsUserSelected && (
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${answer.IsCorrect
                                  ? "bg-green-600 text-white"
                                  : "bg-red-600 text-white"
                                  }`}
                              >
                                {answer.IsCorrect ? (
                                  <IoCheckmarkCircle />
                                ) : (
                                  <IoCloseCircle />
                                )}
                                Your answer
                              </span>
                            )}

                            {answer.IsCorrect && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-green-700 ring-1 ring-green-200">
                                <IoCheckmarkCircle />
                                Correct answer
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ),
                  )}

                  {(question.TblMasterMcqAnswer ?? []).length === 0 && (
                    <p className="text-sm font-medium italic text-slate-400">
                      No answer options available.
                    </p>
                  )}
                </div>

                {!!question.AnswerExplanation && (
                  <div className="rounded-xl border border-blue-100 bg-[#F4F8FC] p-4 sm:p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-secondary">
                      <IoSparklesOutline className="text-lg text-primary" />
                      Explanation
                    </div>
                    <div
                      className="text-sm leading-7 text-slate-600 [&_a]:text-secondary [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_ol]:space-y-1 [&_p+p]:mt-2 [&_ul]:space-y-1"
                      dangerouslySetInnerHTML={{
                        __html: question.AnswerExplanation,
                      }}
                    />
                  </div>
                )}

                {(!!question.AnswerLink || !!question.AnswerDocumentUrl) && (
                  <div className="flex flex-wrap gap-2.5 border-t border-slate-100 pt-4">
                    {!!question.AnswerLink && question.AnswerLink !== "0" && (
                      <a
                        href={question.AnswerLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3.5 py-2 text-sm font-bold text-secondary transition hover:border-secondary hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
                      >
                        <IoOpenOutline className="text-base text-primary" />
                        Open explanation
                      </a>
                    )}

                    {!!question.AnswerDocumentUrl &&
                      question.AnswerDocumentUrl !== "0" && (
                        <a
                          href={question.AnswerDocumentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-3.5 py-2 text-sm font-bold text-primary-dark transition hover:border-primary hover:bg-orange-50 focus:outline-none focus:ring-4 focus:ring-orange-100"
                        >
                          <IoAttachOutline className="text-base" />
                          View attachment
                        </a>
                      )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </ModalComp2>
  );
};

export default SubmittedAnswersModal;
