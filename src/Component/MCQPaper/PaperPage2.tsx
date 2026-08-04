import { format } from "date-fns";
import { useEffect, useState } from "react";
import { CgSandClock } from "react-icons/cg";
import {
  FaLock,
  FaLockOpen,
  FaQuestion,
  FaRegLightbulb,
  FaSection,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFetchAnsAfterExamSubmitMutation } from "../../Api/p2twebApi";
import {
  useFetchDbAnswersMutation,
  useSubmitExamMutation,
} from "../../Api/spAppApi";
import convertData from "../../Helper/ConvertData";
import examTimeFormatter from "../../Helper/examTimeFormatter";
import rtkErrorRead from "../../Helper/rtkErrorRead";
import {
  loadInitialOptions,
  setSelectedPackageId,
} from "../../Store/Slice/McqSlice";
import { RootState } from "../../Store/Store";
import {
  TblMasterMcqAnswer,
  TblMasterMCQQuestion,
} from "../../interface/MCQQuestion";
import "../../styles/drawer.css";
import SubmittedAnswersModal from "./SubmittedAnswersModal";

const PaperPage2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dbAnsApi] = useFetchDbAnswersMutation();
  const [attemptApi] = useSubmitExamMutation();
  const [ansApi] = useFetchAnsAfterExamSubmitMutation();

  const {
    selectedMcqPaper: paper,
    selectedInternalService,
    selectedPackage,
  } = useSelector((s: RootState) => s.detailed);
  const [paperMeta, setPaperMeta] = useState<PaperMeta>({
    qusCount: 0,
    sectionCount: 0,
  });
  const [isAgree, setIsAgree] = useState<boolean>(false);
  const [submittedAnsList, setSubmittedAnsList] = useState<TblMasterMCQQuestion[]>([]);
  const [ansModalOpen, setAnsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (Object.keys(paper).length === 0) {
      navigate("/mcq", { replace: true });
    } else {
      let qusCount = 0;
      let sectionCount = 0;
      paper.TblMasterMCQSection?.forEach((s) => {
        qusCount += s.MinQuestionAttempt ?? 0;
        sectionCount += 1;
      });
      setPaperMeta({ qusCount, sectionCount });
    }
  }, [paper]);

  async function handleExamStart() {
    const PaperType = selectedInternalService?.ServicesTypeName;
    const packageId = selectedPackage?.PackageId ?? 0;

    if (PaperType !== "QuickPractice") {
      const res = await dbAnsApi({
        MCQExamHistory: {
          MCQPaperId: paper.MCQPaperId,
        },
      });
      if (res.error) {
        // fetch asn to show
        const { status } = res.error as any;

        if (status === 440) {
          if (submittedAnsList?.length === 0) {
            const ansRes = await ansApi({ PaperId: paper.MCQPaperId });
            if (ansRes.error) {
              rtkErrorRead(ansRes.error);
            } else {
              const ans = convertData(ansRes?.data?.result) || [];
              if (Array.isArray(ans)) {
                setSubmittedAnsList(ans);
                setAnsModalOpen(true);
              }
            }
          } else {
            setAnsModalOpen(true);
          }
        } else {
          rtkErrorRead(res.error);
        }
      } else {
        const data = JSON.parse(res?.data?.result);

        if (
          typeof data === "string" &&
          data?.toLowerCase()?.includes("fresh exam")
        ) {
          await attemptApi({
            MCQExamHistory: {
              ExamId: paper.MCQPaperId,
              ExamType: PaperType,
              ExamName: paper.MCQPaperName,
              ObtainMarks: 0,
              AttemptDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            },
          })
            .then(() => {
              dispatch(setSelectedPackageId(packageId));
              navigate("/mcqQuestion", {
                state: {
                  packageId: packageId,
                  MCQSetId: paper?.MCQSetId,
                  duration: paper?.PaperDuration,
                  MCQPaperId: paper.MCQPaperId,
                  IsNegativeMark: paper.IsNegativeMark,
                  SaveToDb: PaperType !== "QuickPractice",
                },
              });
            })
            .catch((err) => {
              rtkErrorRead(err);
            });
        } else {
          const { AttemptedQuestions, RemainingTime } = data[0];
          dispatch(setSelectedPackageId(packageId));
          if (!!AttemptedQuestions?.length) {
            const options: TblMasterMcqAnswer[] = [];
            AttemptedQuestions?.forEach((question: any) => {
              question?.AnswerOptions?.forEach((ans: any) => {
                options.push({
                  IsCorrect: ans?.IsCorrect,
                  MCQOption: ans?.MCQOption,
                  MCQOptionId: ans?.MCQOptionId,
                  MCQPartialCorrectMarks: ans?.MCQPartialCorrectMarks,
                  MCQPartialNegativeMarks: ans?.MCQPartialNegativeMarks,
                  MCQQuestionId: question?.MCQQuestionId,
                  ...(!!ans?.OneWordAnswer && {
                    OneWordAnswer: ans?.OneWordAnswer,
                  }),
                });
              });
            });
            dispatch(loadInitialOptions(options));

            navigate("/mcqQuestion", {
              state: {
                packageId: packageId,
                MCQSetId: paper?.MCQSetId,
                duration: RemainingTime ?? paper?.PaperDuration,
                MCQPaperId: paper?.MCQPaperId,
                IsNegativeMark: paper?.IsNegativeMark,
                SaveToDb: PaperType !== "QuickPractice",
              },
            });
          } else {
            navigate("/mcqQuestion", {
              state: {
                packageId: packageId,
                MCQSetId: paper?.MCQSetId,
                duration: paper?.PaperDuration,
                MCQPaperId: paper?.MCQPaperId,
                IsNegativeMark: paper?.IsNegativeMark,
                SaveToDb: PaperType !== "QuickPractice",
              },
            });
          }
        }
      }
    } else {
      dispatch(setSelectedPackageId(packageId));
      navigate("/mcqQuestion", {
        state: {
          packageId: packageId,
          MCQSetId: paper?.MCQSetId,
          duration: paper?.PaperDuration,
          MCQPaperId: paper?.MCQPaperId,
          IsNegativeMark: paper?.IsNegativeMark,
          SaveToDb: PaperType !== "QuickPractice",
        },
      });
    }
  }

  return (
    <main className="h-screen p-6">
      <header className="bg-[#DCE9F9] rounded-3xl md:p-8 p-4 relative overflow-hidden shadow">
        <h1 className="md:text-5xl text-xl font-bold text-secondary">
          {paper.MCQPaperName}
        </h1>
        {/* <div className="inline-flex items-center gap-2 bg-primary text-secondary px-4 py-2 rounded-full font-semibold shadow-sm">
                    <CgSandClock />
                    {!!paper.MCQStartTime && <span>{`Start Time ${format(new Date(paper.MCQStartTime), 'HH:mm aa')}`}</span>}
                </div> */}
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <div className="p-6 rounded-2xl shadow  flex justify-between items-center">
          <div>
            <p className="text-secondary text-sm font-semibold mb-1">
              Duration
            </p>
            <p className="text-3xl font-bold text-primary">
              {examTimeFormatter(paper.PaperDuration ?? 0)}
            </p>
          </div>
          <CgSandClock className="text-primary text-6xl" />
        </div>
        <div className="p-6 rounded-2xl shadow  flex justify-between items-center">
          <div>
            <p className="text-secondary text-sm font-semibold mb-1">
              Total Questions
            </p>
            <p className="text-3xl font-bold text-primary">
              {paperMeta.qusCount}
            </p>
          </div>
          <FaQuestion className="text-primary text-6xl" />
        </div>
        <div className="p-6 rounded-2xl shadow  flex justify-between items-center">
          <div>
            <p className="text-secondary text-sm font-semibold mb-1">
              Total Marks
            </p>
            <p className="text-3xl font-bold text-primary">
              {paper.TotalMarks}
            </p>
          </div>
          <CgSandClock className="text-primary text-6xl" />
        </div>
        <div className="p-6 rounded-2xl shadow  flex justify-between items-center">
          <div>
            <p className="text-secondary text-sm font-semibold mb-1">
              Sections
            </p>
            <p className="text-3xl font-bold text-primary">
              {paperMeta.sectionCount}
            </p>
          </div>
          <FaSection className="text-primary text-6xl" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-secondary-dark mt-6">
        Exam Instruction
      </h2>

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <div
          className="bg-[#eef6ff] p-5 sm:p-6 lg:p-8 rounded-3xl w-full lg:max-w-[60%] text-sm sm:text-base leading-relaxed text-slate-800 break-words overflow-hidden instruction-content"
          dangerouslySetInnerHTML={{ __html: paper?.Instruction ?? "" }}
        />

        <div className="w-full lg:flex-1">
          <div className="bg-[#fff9eb] border border-amber-200 p-5 sm:p-6 rounded-3xl mb-6 lg:mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaRegLightbulb className="text-primary text-2xl shrink-0" />
              <h3 className="text-secondary font-semibold text-lg">
                Last Minute Tip
              </h3>
            </div>

            <p className="text-amber-800/80 leading-relaxed text-sm sm:text-base">
              Read each question carefully before answering. Keep an eye on the
              timer and avoid spending too much time on a single question.
              Review your answers before final submission.
            </p>
          </div>

          <label className="flex items-start gap-3 sm:gap-4 cursor-pointer group">
            <div className="relative flex items-center pt-0.5 shrink-0">
              <input
                className="h-5 w-5 rounded bg-secondary transition-all cursor-pointer"
                type="checkbox"
                onChange={(e) => setIsAgree(e.target.checked)}
                checked={isAgree}
              />
            </div>

            <span className="text-secondary text-sm sm:text-base leading-relaxed group-hover:text-primary transition-colors">
              Have you read and understood the instructions mentioned under the
              guidelines?
            </span>
          </label>

          <div className="mt-8 sm:mt-10 lg:mt-12">
            <button
              className="w-full sm:max-w-[300px] flex items-center justify-center gap-3 bg-primary disabled:bg-primary-foreground text-primary-foreground disabled:text-slate-200 py-4 sm:py-5 px-6 sm:px-8 rounded-full font-bold text-lg sm:text-xl disabled:cursor-not-allowed transition-all shadow-sm mb-4"
              disabled={!isAgree}
              onClick={() => handleExamStart()}
            >
              {isAgree ? <FaLockOpen /> : <FaLock />}
              Start Exam
            </button>
          </div>
        </div>
      </div>

      <SubmittedAnswersModal
        submittedAnsList={submittedAnsList}
        onClose={() => setAnsModalOpen(false)}
        open={ansModalOpen}
      />
    </main>
  );
};

interface PaperMeta {
  qusCount: number;
  sectionCount: number;
}

export default PaperPage2;
