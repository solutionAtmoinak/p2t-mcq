import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoDocumentTextOutline,
  IoExitOutline,
  IoHelpCircleOutline,
  IoRibbonOutline,
  IoStatsChartOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useSubmitAnswerMutation,
  useSubmitExamMutation,
} from "../../Api/spAppApi";
import rtkErrorRead from "../../Helper/rtkErrorRead";
import toastNotify from "../../Helper/ToastNotify";
import { TblMasterMcqAnswer } from "../../interface/MCQQuestion";
import { resetSelectedOptions } from "../../Store/Slice/McqSlice";
import { RootState } from "../../Store/Store";
import ResultExplanationPreview from "./ResultExplanationPreview";

const formatDuration = (value: unknown) => {
  const parsedSeconds = Number(value);

  if (!Number.isFinite(parsedSeconds) || parsedSeconds < 0) return "--";

  const totalSeconds = Math.floor(parsedSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds
      .toString()
      .padStart(2, "0")}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  }

  return `${seconds}s`;
};

const ResultPage2 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const submittedTime = useRef<string>(
    format(new Date(), "yyyy-MM-dd hh:mm:ss"),
  );

  const { selectedOptions, mcqQuestionList: question } = useSelector((state: RootState) => state.mcqQuestion);
  const { selectedMcqPaper } = useSelector((state: RootState) => state.detailed);

  const [submitAnsApi] = useSubmitAnswerMutation();
  const [submitExamApi] = useSubmitExamMutation();

  // const [downloadCertificateApi] = useDownloadCertificateMutation();

  useEffect(() => {
    if (!!!selectedMcqPaper?.MCQPaperId) {
      navigate("/mcq");
    }
  }, [selectedMcqPaper]);

  const [totalCorrectMarks, setTotalCorrectMarks] = useState(0);
  const { resultData } = location.state;
  const {
    TotalMarks,
    // TotalPassMarks,
    // TimeLeft,
    // MCQPaperName,
    IsNegativeMark,
    SpendedTime,
  } = resultData;

  useEffect(() => {
    let correctMarks = 0;
    selectedOptions.forEach((opt) => {
      if (opt.IsCorrect) {
        correctMarks += opt.MCQPartialCorrectMarks ?? 0;
      } else {
        correctMarks -= opt.MCQPartialNegativeMarks ?? 0;
      }
    });

    setTotalCorrectMarks(correctMarks);
    // console.log({ selectedOptions });

    if (location.state.SaveToDb) {
      submitAnsToDb(correctMarks);
    }
  }, [selectedOptions, location]);

  async function submitAnsToDb(marks: number) {
    const options = selectedOptions.map((opt: TblMasterMcqAnswer) => {
      return {
        MCQQuestionId: opt.MCQQuestionId,
        MCQOptionId: opt.MCQOptionId,
        MCQPaperId: selectedMcqPaper.MCQPaperId,
        IsCorrect: !!opt.IsCorrect,
        Marks: opt.MCQPartialCorrectMarks,
        OneWordAnswer: opt.OneWordAnswer,
      };
    });

    if (Array.isArray(options)) {
      const [res1, res2] = await Promise.all([
        submitAnsApi({
          QuestionAnswerListofStudent: options,
        }),
        submitExamApi({
          MCQExamHistory: {
            ExamId: selectedMcqPaper.MCQPaperId,
            ExamType: selectedMcqPaper.PaperType,
            ExamName: selectedMcqPaper.MCQPaperName,
            ObtainMarks: marks,
            AttemptDate: location.state.examStartTime,
            SubmitDate: submittedTime.current,
          },
        }),
      ]);

      if (res1.error) {
        rtkErrorRead(res1.error);
      } else if (res2.error) {
        rtkErrorRead(res2.error);
      } else {
        toastNotify(res2.data?.result, "success");
      }
    }
  }




  const percentage =
    TotalMarks > 0
      ? Math.max(
        0,
        Math.min(100, Math.round((totalCorrectMarks / TotalMarks) * 100)),
      )
      : 0;

  const answeredCount = Math.min(selectedOptions.length, question.length);
  const correctCount = selectedOptions.filter((option) => !!option.IsCorrect).length;
  const incorrectCount = Math.max(0, answeredCount - correctCount);
  const unansweredCount = Math.max(0, question.length - answeredCount);

  const performanceLabel =
    percentage >= 80
      ? "Excellent result"
      : percentage >= 60
        ? "Good result"
        : percentage >= 40
          ? "Keep improving"
          : "Needs improvement";

  const formattedSpentTime = formatDuration(SpendedTime);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "radialBar" as const,
      height: 800,
      fontFamily: "inherit",
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "62%",
        },
        track: {
          background: "#E1EDF9",
          strokeWidth: "100%",
          margin: 4,
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: 34,
            fontSize: "13px",
            fontWeight: 600,
            color: "#64748b",
          },
          value: {
            offsetY: -10,
            fontSize: "36px",
            fontWeight: 700,
            color: "#003B6B",
            formatter: () => `${percentage}%`,
          },
        },
      },
    },
    colors: ["#f59e0b"],
    stroke: {
      lineCap: "round",
    },
    labels: ["Overall score"],
  };

  const distributionOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "donut" as const,
      fontFamily: "inherit",
      toolbar: {
        show: false,
      },
    },
    labels: ["Correct", "Incorrect", "Unanswered"],
    colors: ["#22c55e", "#ef4444", "#F29F05"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      fontSize: "13px",
      fontWeight: 500,
      labels: {
        colors: "#475569",
      },
      markers: {
        size: 6,
        offsetX: -3,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 4,
      },
    },
    stroke: {
      width: 5,
      colors: ["#ffffff"],
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 18,
              color: "#64748b",
              fontSize: "12px",
            },
            value: {
              show: true,
              offsetY: -18,
              color: "#003B6B",
              fontSize: "28px",
              fontWeight: 700,
            },
            total: {
              show: true,
              label: "Questions",
              color: "#64748b",
              fontSize: "12px",
              fontWeight: 600,
              formatter: () => question.length.toString(),
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} question${value === 1 ? "" : "s"}`,
      },
    },
  };

  return (
    <main className="h-[100dvh] overflow-hidden bg-slate-50 p-2 sm:p-3 lg:p-4">
      <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-3">
        <header className="relative shrink-0 overflow-hidden rounded-2xl border border-blue-100 bg-[#DCE9F9] px-4 py-3 shadow-sm sm:px-5 sm:py-4">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-primary" />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary/60 sm:text-xs">
                <IoRibbonOutline className="text-base text-primary" />
                Assessment result
              </div>
              <h1 className="truncate text-xl font-bold text-primary sm:text-2xl">
                {selectedMcqPaper.MCQPaperName}
              </h1>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs font-semibold text-secondary sm:gap-2 sm:text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-2.5 py-1.5 sm:px-3">
                <IoDocumentTextOutline className="text-base text-primary" />
                {question.length} questions
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-2.5 py-1.5 sm:px-3">
                <IoStatsChartOutline className="text-base text-primary" />
                {TotalMarks} total marks
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-2.5 py-1.5 sm:px-3">
                <IoTimeOutline className="text-base text-primary" />
                {formattedSpentTime} spent
              </span>
            </div>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-rows-[minmax(240px,42dvh)_minmax(0,1fr)] gap-3 lg:grid-cols-[390px_minmax(0,1fr)] lg:grid-rows-1 xl:grid-cols-[420px_minmax(0,1fr)]">
          <section
            aria-label="Performance summary"
            className="grid min-h-0 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1"
          >
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-start justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Your performance
                  </p>
                  <h2 className="mt-0.5 text-base font-bold text-secondary">
                    Score overview
                  </h2>
                </div>
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-primary">
                  {performanceLabel}
                </span>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_120px] items-center gap-1 px-3 py-2">
                <div className="flex min-w-0 justify-center">
                  <ReactApexChart
                    options={options}
                    series={[percentage]}
                    type="radialBar"
                    height={180}
                    width="100%"
                  />
                </div>

                <div className="space-y-2">
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <p className="text-[10px] font-semibold text-slate-500">
                      Marks obtained
                    </p>
                    <p className="mt-1 text-base font-bold text-secondary">
                      {totalCorrectMarks.toFixed(2)}
                      <span className="text-xs font-semibold text-slate-400">
                        {" "}/ {TotalMarks}
                      </span>
                    </p>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-2.5">
                    <p className="text-[10px] font-semibold text-slate-500">
                      Accuracy
                    </p>
                    <p className="mt-1 text-base font-bold text-primary">
                      {answeredCount > 0
                        ? Math.round((correctCount / answeredCount) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Response analysis
                </p>
                <h2 className="mt-0.5 text-base font-bold text-secondary">
                  Answer distribution
                </h2>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Answered
                        </p>
                        <p className="mt-1 text-xl font-bold text-secondary">
                          {answeredCount}
                        </p>
                      </div>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                        <IoDocumentTextOutline className="text-lg" />
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-orange-100">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${question.length ? (answeredCount / question.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Correct
                        </p>
                        <p className="mt-1 text-xl font-bold text-secondary">
                          {correctCount}
                        </p>
                      </div>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500 text-white">
                        <IoCheckmarkCircleOutline className="text-xl" />
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-green-100">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${answeredCount ? (correctCount / answeredCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Incorrect
                        </p>
                        <p className="mt-1 text-xl font-bold text-secondary">
                          {incorrectCount}
                        </p>
                      </div>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white">
                        <IoCloseCircleOutline className="text-xl" />
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-red-100">
                      <div
                        className="h-full rounded-full bg-red-500"
                        style={{ width: `${answeredCount ? (incorrectCount / answeredCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-[#EEF6FD] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Unanswered
                        </p>
                        <p className="mt-1 text-xl font-bold text-secondary">
                          {unansweredCount}
                        </p>
                      </div>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-white">
                        <IoHelpCircleOutline className="text-xl" />
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-blue-100">
                      <div
                        className="h-full rounded-full bg-secondary"
                        style={{ width: `${question.length ? (unansweredCount / question.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex justify-center border-t border-slate-100 pt-1">
                  <ReactApexChart
                    options={distributionOptions}
                    series={[correctCount, incorrectCount, unansweredCount]}
                    type="donut"
                    height={205}
                    width="100%"
                  />
                </div>
              </div>
            </article>
          </section>

          <section
            aria-label="Answer review"
            className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-2"
          >
            <ResultExplanationPreview
              NegativeMarking={IsNegativeMark}
              selectedOptions={selectedOptions}
              question={question}
            />
            <div className="flex shrink-0 justify-end">
              {/* <button
            onClick={downloadCertificate}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg text-green-100 bg-amber-500 text-sm sm:text-base font-medium"
          >
            Download Certificate
          </button> */}

              {/* <button
            onClick={downloadPdf}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg text-green-100 bg-green-500 text-sm sm:text-base font-medium"
          >
            Download Answers
          </button> */}

              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-hover focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto"
                onClick={() => {
                  dispatch(resetSelectedOptions());
                  navigate("/mcq", { replace: true });
                }}
              >
                <IoExitOutline className="text-lg" />
                Save & Exit
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ResultPage2;


// const downloadPdf = async () => {
//   const doc = new jsPDF();
//   const margin = 10;
//   const padding = 5;
//   const usableWidth = doc.internal.pageSize.width - 2 * (margin + padding);
//   const usableHeight = doc.internal.pageSize.height - 2 * margin;

//   let y = margin + padding;
//   let currentPage = 1;

//   const drawBorder = () => {
//     doc.rect(
//       margin,
//       margin,
//       doc.internal.pageSize.width - 2 * margin,
//       doc.internal.pageSize.height - 2 * margin,
//     );
//   };

//   drawBorder();
//   doc.setFontSize(12);
//   doc.setTextColor(0, 0, 0);

//   y += 10;
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(14);
//   doc.text("MCQ Question / Answers", doc.internal.pageSize.width / 2, y, {
//     align: "center",
//   });
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(12);
//   y += 15;

//   const addPageIfNeeded = (lineCount: number) => {
//     if (y + lineCount * 8 > margin + usableHeight) {
//       doc.addPage();
//       currentPage++;
//       drawBorder();
//       y = margin + padding;
//     }
//   };
//   // y += 15;

//   question.forEach((q, index) => {
//     doc.setFontSize(10);
//     // Passage
//     if (q.PassageDetails?.trim()) {
//       const plainPassage = stripHtmlTags(q.PassageDetails);
//       const passageLines = doc.splitTextToSize(
//         `Passage: ${plainPassage}`,
//         usableWidth,
//       );
//       addPageIfNeeded(passageLines.length);
//       passageLines.forEach((line: any) => {
//         doc.text(line, margin + padding, y);
//         y += 8;
//       });
//       y += 4;
//     }
//     doc.setFontSize(12);
//     doc.setTextColor(7, 37, 84);
//     const questionLines = doc.splitTextToSize(q.MCQQuestion!, 165);
//     addPageIfNeeded(questionLines.length);

//     if (questionLines.length > 0) {
//       doc.text(`${index + 1}. ${questionLines[0]}`, margin + padding, y);
//       y += 8;

//       for (let i = 1; i < questionLines.length; i++) {
//         doc.text(questionLines[i], margin + padding + 10, y);
//         y += 8;
//       }
//     }

//     y += 4;
//     doc.setTextColor(0, 0, 0);
//     // Correct answers
//     let correctAnswers = "";

//     q.MCQOptions?.forEach((o, i) => {
//       if (o.IsCorrect) {
//         if (correctAnswers === "") {
//           correctAnswers += `${String.fromCharCode(65 + i)}) ${o.MCQOption}`;
//         } else {
//           correctAnswers += `, ${String.fromCharCode(65 + i)}) ${o.MCQOption}`;
//         }
//       }
//     });
//     const answerLines = doc.splitTextToSize(
//       `Correct Answer(s): ${correctAnswers}`,
//       165,
//     );
//     addPageIfNeeded(answerLines.length);
//     doc.setFont("helvetica", "bold");
//     answerLines.forEach((line: any) => {
//       doc.text(line, margin + padding, y);
//       y += 8;
//     });

//     doc.setFont("helvetica", "normal");
//     y += 4;

//     // explanation
//     if (q.AnswerExplanation?.trim()) {
//       const plainPassage = stripHtmlTags(q.AnswerExplanation);

//       // Bold label
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(12);
//       const label = "Explanation:";
//       const labelLines = doc.splitTextToSize(label, usableWidth);
//       addPageIfNeeded(labelLines.length);
//       labelLines.forEach((line: any) => {
//         doc.text(line, margin + padding, y);
//         y += 8;
//       });

//       // Normal text on next line
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       const explanationLines = doc.splitTextToSize(plainPassage, usableWidth);
//       addPageIfNeeded(explanationLines.length);
//       explanationLines.forEach((line: any) => {
//         doc.text(line, margin + padding, y);
//         y += 7;
//       });
//     }

//     y += 10;
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(12);
//   });

//   for (let i = 1; i <= currentPage; i++) {
//     doc.setPage(i);
//     doc.text(
//       `Page ${i} of ${currentPage}`,
//       doc.internal.pageSize.width / 2,
//       doc.internal.pageSize.height - margin / 2,
//       { align: "center" },
//     );
//   }

//   doc.save("mcq-qa.pdf");
// };

// const stripHtmlTags = (html: string): string =>
//   html
//     .replace(/<[^>]*>/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();

// async function downloadCertificate() {
//   const res = await downloadCertificateApi({
//     MCQSetId: selectedMcqPaper?.MCQSetId,
//     PaperId: selectedMcqPaper?.MCQPaperId,
//     PackageId: packageId,
//     CertificateType: "Mcq",
//   });
//   if (res.error) {
//     rtkErrorRead(res.error);
//   } else {
//     const html = JSON.parse(res.data?.result); // HTML STRING

//     // Create hidden container
//     const container = document.createElement("div");
//     container.innerHTML = html;

//     container.style.position = "fixed";
//     container.style.top = "0";
//     container.style.left = "0";
//     container.style.pointerEvents = "none";
//     container.style.zIndex = "-100";

//     document.body.appendChild(container);

//     await html2canvas(container, {
//       scale: 2,
//       useCORS: true,
//     }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");

//       const pdf = new jsPDF("l", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();

//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("certificate.pdf");
//     });

//     document.body.removeChild(container);
//   }
// }
