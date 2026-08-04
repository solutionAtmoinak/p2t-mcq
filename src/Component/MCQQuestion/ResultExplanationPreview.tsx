import { useMemo } from "react";
import {
    IoAttachOutline,
    IoCheckmarkCircle,
    IoCloseCircle,
    IoDocumentTextOutline,
    IoHelpCircle,
    IoOpenOutline,
    IoSparklesOutline,
} from "react-icons/io5";
import MathMLComp from "../../Helper/MathMlComp";
import {
    TblMasterMcqAnswer,
    TblMasterMCQQuestion,
} from "../../interface/MCQQuestion";

interface Props {
    question: TblMasterMCQQuestion[];
    selectedOptions: TblMasterMcqAnswer[];
    NegativeMarking: boolean;
}

const ResultExplanationPreview = (props: Props) => {
    const { question, selectedOptions, NegativeMarking } = props;

    const qusAndMarksMap = useMemo(() => {
        const marksMap = new Map<number, number>();

        selectedOptions.forEach((answer) => {
            if (answer.MCQQuestionId == null) return;

            const questionId = Number(answer.MCQQuestionId);
            const currentMarks = marksMap.get(questionId) ?? 0;
            const answerMarks = answer.IsCorrect
                ? answer.MCQPartialCorrectMarks ?? 0
                : NegativeMarking
                    ? -(answer.MCQPartialNegativeMarks ?? 0)
                    : 0;

            marksMap.set(questionId, currentMarks + answerMarks);
        });

        return marksMap;
    }, [NegativeMarking, selectedOptions]);

    return (
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
                        Compare your responses with the correct answers and explanations.
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-xl bg-[#EEF6FD] px-3 py-2 text-xs font-semibold text-secondary sm:text-sm">
                    <IoDocumentTextOutline className="text-lg text-primary" />
                    {question.length} question{question.length === 1 ? "" : "s"}
                </div>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-2.5 sm:p-4">
                {question.map((q, index) => {
                    const questionId = Number(q.MCQQuestionId);
                    const selectedAnswers = selectedOptions.filter(
                        (answer) => Number(answer.MCQQuestionId) === questionId,
                    );

                    const correctAnswers = (q.MCQOptions ?? [])
                        .map((option, optionIndex) => ({ ...option, index: optionIndex }))
                        .filter((option) => !!option.IsCorrect);

                    const userAnswers =
                        q.MCQQuestionType === "One Word Answer"
                            ? selectedAnswers.map((answer) => ({
                                ...answer,
                                MCQOption: answer.OneWordAnswer,
                            }))
                            : selectedAnswers.map((answer) => {
                                const optionIndex = (q.MCQOptions ?? []).findIndex(
                                    (option) => option.MCQOptionId === answer.MCQOptionId,
                                );
                                const matchedOption = (q.MCQOptions ?? [])[optionIndex];

                                return {
                                    ...answer,
                                    ...matchedOption,
                                    index: optionIndex,
                                };
                            });

                    const isAttempted = selectedAnswers.length > 0;
                    const isCorrect =
                        isAttempted && selectedAnswers.every((answer) => !!answer.IsCorrect);
                    const questionMarks = qusAndMarksMap.get(questionId) ?? 0;

                    return (
                        <article
                            key={q.MCQQuestionId ?? index}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                            <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-bold text-primary ring-1 ring-orange-100">
                                        {index + 1}
                                    </span>

                                    <div className="min-w-0 flex-1 pt-1 text-sm font-semibold leading-6 text-secondary sm:text-base">
                                        <MathMLComp data={String(q.MCQQuestion ?? "")} />
                                    </div>

                                    <span
                                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold sm:px-3 sm:text-xs ${!isAttempted
                                                ? "bg-slate-700 text-white shadow-sm ring-2 ring-slate-200"
                                                : isCorrect
                                                    ? "bg-green-600 text-white shadow-sm ring-2 ring-green-100"
                                                    : "bg-red-600 text-white shadow-sm ring-2 ring-red-100"
                                            }`}
                                    >
                                        {!isAttempted ? (
                                            <IoHelpCircle className="text-sm" />
                                        ) : isCorrect ? (
                                            <IoCheckmarkCircle className="text-sm" />
                                        ) : (
                                            <IoCloseCircle className="text-sm" />
                                        )}
                                        {!isAttempted
                                            ? "Not answered"
                                            : isCorrect
                                                ? "Correct"
                                                : "Incorrect"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 p-3 sm:p-4">
                                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_140px]">
                                    <div
                                        className={`rounded-xl border p-4 ${!isAttempted
                                                ? "border-slate-200 bg-slate-50"
                                                : isCorrect
                                                    ? "border-green-200 bg-green-50/70"
                                                    : "border-red-200 bg-red-50/70"
                                            }`}
                                    >
                                        <p
                                            className={`text-xs font-bold uppercase tracking-wide ${!isAttempted
                                                    ? "text-slate-600"
                                                    : isCorrect
                                                        ? "text-green-700"
                                                        : "text-red-700"
                                                }`}
                                        >
                                            Your answer
                                        </p>
                                        <div className="mt-2 space-y-2">
                                            {userAnswers.length > 0 ? (
                                                userAnswers.map((answer, answerIndex) => (
                                                    <div
                                                        key={answer.MCQOptionId ?? answerIndex}
                                                        className="flex min-w-0 items-start gap-2 text-sm text-slate-700"
                                                    >
                                                        {q.MCQQuestionType !== "One Word Answer" &&
                                                            typeof answer.index === "number" &&
                                                            answer.index >= 0 && (
                                                                <span
                                                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${isCorrect
                                                                            ? "bg-green-100 text-green-700"
                                                                            : "bg-red-100 text-red-700"
                                                                        }`}
                                                                >
                                                                    {String.fromCharCode(65 + answer.index)}
                                                                </span>
                                                            )}
                                                        {(!isCorrect ||
                                                            q.MCQQuestionType === "One Word Answer") && (
                                                                <div className="min-w-0 flex-1 break-words font-normal leading-6">
                                                                    <MathMLComp
                                                                        data={String(
                                                                            answer.MCQOption ??
                                                                            answer.OneWordAnswer ??
                                                                            "",
                                                                        )}
                                                                    />
                                                                </div>
                                                            )}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-sm font-medium italic text-slate-400">
                                                    Not attempted
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                                        <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">
                                            Correct answer
                                        </p>
                                        <div className="mt-2 space-y-2">
                                            {correctAnswers.length > 0 ? (
                                                correctAnswers.map((answer, answerIndex) => (
                                                    <div
                                                        key={answer.MCQOptionId ?? answerIndex}
                                                        className="flex min-w-0 items-start gap-2 text-sm font-normal text-slate-700"
                                                    >
                                                        {q.MCQQuestionType !== "One Word Answer" &&
                                                            typeof answer.index === "number" && (
                                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orange-100 text-xs font-bold text-primary-dark">
                                                                    {String.fromCharCode(65 + answer.index)}
                                                                </span>
                                                            )}
                                                        {(!isCorrect ||
                                                            q.MCQQuestionType === "One Word Answer") && (
                                                                <div className="min-w-0 flex-1 break-words font-normal leading-6">
                                                                    <MathMLComp
                                                                        data={String(answer.MCQOption ?? "")}
                                                                    />
                                                                </div>
                                                            )}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-sm font-medium text-slate-400">
                                                    No answer provided
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className={`rounded-xl border p-4 ${questionMarks > 0
                                                ? "border-green-100 bg-green-50/70"
                                                : questionMarks < 0
                                                    ? "border-red-100 bg-red-50/70"
                                                    : "border-slate-200 bg-slate-50"
                                            }`}
                                    >
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Marks
                                        </p>
                                        <p
                                            className={`mt-2 text-lg font-bold ${questionMarks > 0
                                                    ? "text-green-600"
                                                    : questionMarks < 0
                                                        ? "text-red-600"
                                                        : "text-slate-600"
                                                }`}
                                        >
                                            {questionMarks > 0 ? "+" : ""}
                                            {questionMarks.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {!!q.AnswerExplanation && (
                                    <div className="rounded-xl border border-blue-100 bg-[#F4F8FC] p-4 sm:p-5">
                                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-secondary">
                                            <IoSparklesOutline className="text-lg text-primary" />
                                            Explanation
                                        </div>
                                        <div
                                            className="text-sm leading-7 text-slate-600 [&_a]:text-secondary [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_ol]:space-y-1 [&_p+p]:mt-2 [&_ul]:space-y-1"
                                            dangerouslySetInnerHTML={{ __html: q.AnswerExplanation }}
                                        />
                                    </div>
                                )}

                                {(!!q.AnswerLink || !!q.AnswerDocumentUrl) && (
                                    <div className="flex flex-wrap gap-2.5 border-t border-slate-100 pt-4">
                                        {!!q.AnswerLink && q.AnswerLink !== "0" && (
                                            <a
                                                href={q.AnswerLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3.5 py-2 text-sm font-bold text-secondary transition hover:border-secondary hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                            >
                                                <IoOpenOutline className="text-base text-primary" />
                                                Open explanation
                                            </a>
                                        )}

                                        {!!q.AnswerDocumentUrl && q.AnswerDocumentUrl !== "0" && (
                                            <a
                                                href={q.AnswerDocumentUrl}
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
                    );
                })}
            </div>
        </div>
    );
};

export default ResultExplanationPreview;
