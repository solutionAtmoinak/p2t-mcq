import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDownloadCertificateMutation } from "../../Api/p2twebApi";
import { useSubmitAnswerMutation, useSubmitExamMutation } from "../../Api/spAppApi";
import MathMLComp from "../../Helper/MathMlComp";
import rtkErrorRead from "../../Helper/rtkErrorRead";
import toastNotify from "../../Helper/ToastNotify";
import { TblMasterMcqAnswer } from "../../interface/McqQuestion";
import { resetSelectedOptions } from "../../Store/Slice/McqSlice";
import { RootState } from "../../Store/Store";
import IconClock from "../Icon/IconClock";
import IconPeople from "../Icon/IconPeople";

const MCQResultPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const resultData = location.state.resultData;
  const token: string | null = localStorage.getItem("token");
  const [name, setName] = useState("");
  const submittedTime = useRef<string>(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
  // const [negativeCorrect, setNegativeCorrect] = useState(0);
  const { selectedOptions, mcqQuestionList: question, selectedPackageId: packageId } = useSelector((state: RootState) => state.mcqQuestion)
  const { selectedMcqPaper } = useSelector((state: RootState) => state.detailed);

  const [submitAnsApi] = useSubmitAnswerMutation()
  const [submitExamApi] = useSubmitExamMutation()

  const [downloadCertificateApi] = useDownloadCertificateMutation()


  useEffect(() => {
    if (!!!selectedMcqPaper?.MCQPaperId) {
      navigate('/mcq')
    }
  }, [selectedMcqPaper])


  const [totalCorrectMarks, setTotalCorrectMarks] = useState(0);
  const {
    TotalMarks,
    TotalPassMarks,
    TimeLeft,
    MCQPaperName,
    IsNegativeMark,
    SpendedTime
  } = resultData;

  // const onClickQuestions = () => {
  //   console.log("Selected Question from store:", resultData);
  // };
  async function submitAnsToDb(marks: number) {

    const options = selectedOptions.map((opt: TblMasterMcqAnswer) => {

      return {
        MCQQuestionId: opt.MCQQuestionId,
        MCQOptionId: opt.MCQOptionId,
        MCQPaperId: selectedMcqPaper.MCQPaperId,
        IsCorrect: !!opt.IsCorrect,
        Marks: opt.MCQPartialCorrectMarks,
        OneWordAnswer: opt.OneWordAnswer
      }
    });

    if (Array.isArray(options)) {
      submitAnsApi({
        SpendedTime: SpendedTime,
        QuestionAnswerListofStudent: options
      }).then((res: any) => {
        console.log(res?.data?.result);
      }).catch((err) => {
        console.log(err);
      })

      const res = await submitExamApi({
        MCQExamHistory: {
          ExamId: selectedMcqPaper.MCQPaperId,
          ExamType: selectedMcqPaper.PaperType,
          ExamName: selectedMcqPaper.MCQPaperName,
          ObtainMarks: marks,
          AttemptDate: location.state.examStartTime,
          SubmitDate: submittedTime.current,
        }
      })
      if (res.error) {
        rtkErrorRead(res.error)
      } else {
        toastNotify(res.data?.result, "success")
      }
    }
  }

  useEffect(() => {
    let correctMarks = 0
    selectedOptions.forEach((opt) => {
      if (opt.IsCorrect) {
        correctMarks += opt.MCQPartialCorrectMarks ?? 0
      } else {
        correctMarks -= opt.MCQPartialNegativeMarks ?? 0
      }
    })

    setTotalCorrectMarks(correctMarks);
    // console.log({ selectedOptions });

    if (location.state.SaveToDb) {
      submitAnsToDb(correctMarks)
    }

  }, [selectedOptions, location]);

  useEffect(() => {
    if (token) {
      const decoded: any = jwtDecode(token);
      if (
        Object.keys(decoded).includes("FirstName") &&
        Object.keys(decoded).includes("LastName")
      ) {
        const firstName = decoded.FirstName;
        const lastName = decoded.LastName;
        setName(`${firstName} ${lastName}`);
      }
    } else {
      // console.log("No token found");
    }
  }, [token]);

  const remainingMarks = TotalMarks - totalCorrectMarks;

  const donutChart: any = {
    series: [remainingMarks || 0, totalCorrectMarks || 0],
    options: {
      chart: {
        height: 300,
        type: "donut",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        show: false,
      },
      labels: ["Remaining Marks", "Marks Obtained"],
      colors: ["#fc6579", "#94f54e"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
          },
        },
      ],
      legend: {
        position: "bottom",
      },
    },
  };





  const [calculateMarks, setCalculateMarks] = useState<
    { MCQQuestionId: number; marks: number }[]
  >([]);

  useEffect(() => {
    if (selectedOptions.length > 0) {
      handleSelect();
    }
  }, [selectedOptions]);

  const handleSelect = () => {
    const marksMap: { [questionId: number]: number } = {};

    selectedOptions.forEach((option) => {
      const qId: any = option.MCQQuestionId;

      marksMap[qId] ??= 0;

      if (option.IsCorrect) {
        marksMap[qId] += option.MCQPartialCorrectMarks ?? 0;
      } else {
        if (IsNegativeMark) {
          marksMap[qId] -= option.MCQPartialNegativeMarks ?? 0;
        }
      }
      if (!IsNegativeMark && marksMap[qId] < 0) {
        marksMap[qId] = 0;
      }
    });
    const result = Object.entries(marksMap).map(([questionId, marks]) => ({
      MCQQuestionId: Number(questionId),
      marks,
    }));

    // console.log(selectedOptions);
    setCalculateMarks(result);
  };

  const fullTotalMarks = calculateMarks.reduce(
    (total, m) => total + m.marks,
    0
  );

  const downloadPdf = async () => {
    const doc = new jsPDF();
    const margin = 10;
    const padding = 5;
    const usableWidth = doc.internal.pageSize.width - 2 * (margin + padding);
    const usableHeight = doc.internal.pageSize.height - 2 * margin;

    let y = margin + padding;
    let currentPage = 1;

    const drawBorder = () => {
      doc.rect(
        margin,
        margin,
        doc.internal.pageSize.width - 2 * margin,
        doc.internal.pageSize.height - 2 * margin
      );
    };

    drawBorder();
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("MCQ Question / Answers", doc.internal.pageSize.width / 2, y, {
      align: "center",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    y += 15;

    const addPageIfNeeded = (lineCount: number) => {
      if (y + lineCount * 8 > margin + usableHeight) {
        doc.addPage();
        currentPage++;
        drawBorder();
        y = margin + padding;
      }
    };
    // y += 15;

    question.forEach((q, index) => {

      doc.setFontSize(10);
      // Passage
      if (q.PassageDetails?.trim()) {
        const plainPassage = stripHtmlTags(q.PassageDetails);
        const passageLines = doc.splitTextToSize(
          `Passage: ${plainPassage}`,
          usableWidth
        );
        addPageIfNeeded(passageLines.length);
        passageLines.forEach((line: any) => {
          doc.text(line, margin + padding, y);
          y += 8;
        });
        y += 4;
      }
      doc.setFontSize(12);
      doc.setTextColor(7, 37, 84);
      const questionLines = doc.splitTextToSize(q.MCQQuestion!, 165);
      addPageIfNeeded(questionLines.length);

      if (questionLines.length > 0) {
        doc.text(`${index + 1}. ${questionLines[0]}`, margin + padding, y);
        y += 8;

        for (let i = 1; i < questionLines.length; i++) {
          doc.text(questionLines[i], margin + padding + 10, y);
          y += 8;
        }
      }

      y += 4;
      doc.setTextColor(0, 0, 0);
      // Correct answers
      let correctAnswers = ''

      q.MCQOptions?.forEach((o, i) => {
        if (o.IsCorrect) {
          if (correctAnswers === '') {
            correctAnswers += `${String.fromCharCode(65 + i)}) ${o.MCQOption}`
          } else {
            correctAnswers += `, ${String.fromCharCode(65 + i)}) ${o.MCQOption}`
          }
        }
      })
      const answerLines = doc.splitTextToSize(
        `Correct Answer(s): ${correctAnswers}`,
        165
      );
      addPageIfNeeded(answerLines.length);
      doc.setFont("helvetica", "bold");
      answerLines.forEach((line: any) => {
        doc.text(line, margin + padding, y);
        y += 8;
      });

      doc.setFont("helvetica", "normal");
      y += 4;

      // explanation
      if (q.AnswerExplanation?.trim()) {
        const plainPassage = stripHtmlTags(q.AnswerExplanation);

        // Bold label
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        const label = "Explanation:";
        const labelLines = doc.splitTextToSize(label, usableWidth);
        addPageIfNeeded(labelLines.length);
        labelLines.forEach((line: any) => {
          doc.text(line, margin + padding, y);
          y += 8;
        });

        // Normal text on next line
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const explanationLines = doc.splitTextToSize(plainPassage, usableWidth);
        addPageIfNeeded(explanationLines.length);
        explanationLines.forEach((line: any) => {
          doc.text(line, margin + padding, y);
          y += 7;
        });
      }

      y += 10
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
    })

    for (let i = 1; i <= currentPage; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${currentPage}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - margin / 2,
        { align: "center" }
      );
    }

    doc.save("mcq-qa.pdf");
  };


  const stripHtmlTags = (html: string): string =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();


  async function downloadCertificate() {
    const res = await downloadCertificateApi({
      PaperId: selectedMcqPaper?.MCQPaperId,
      PackageId: packageId,
      CertificateType: 'Mcq'
    })
    if (res.error) {
      rtkErrorRead(res.error)
    } else {
      const html = JSON.parse(res.data?.result); // HTML STRING

      // Create hidden container
      const container = document.createElement("div");
      container.innerHTML = html;

      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.pointerEvents = "none";
      container.style.zIndex = "-100";

      document.body.appendChild(container);

      await html2canvas(container, {
        scale: 2,
        useCORS: true,
      }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("l", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("certificate.pdf");
      });

      document.body.removeChild(container);
    }

  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 p-10 overflow-y-auto">
        <div className="h-[80vh] flex flex-col justify-evenly">
          <div className="flex justify-between bg-cyan-600 py-10 rounded-xl text-white h-48 px-28">
            <div className="flex flex-col items-center">
              <IconClock className="mb-4" />
              <h3 className="text-xl font-bold">Time Left</h3>
              <p className="text-2xl font-extrabold">{TimeLeft} </p>
            </div>

            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-bold">#</h1>
              <h3 className="text-xl font-bold">Total Marks</h3>
              <p className="text-2xl font-extrabold">{TotalMarks}</p>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-bold">*</h1>
              <h3 className="text-lg font-bold">Your Marks</h3>
              <p className="text-2xl font-extrabold">{fullTotalMarks}</p>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-bold">?</h1>
              <h3 className="text-lg font-bold">Total Questions</h3>
              <p className="text-2xl font-extrabold">{question.length}</p>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg h-60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 ">
            <div className="">
              <div className="flex gap-6">
                <IconPeople />
                <h4 className="text-xl font-bold mb-4 text-cyan-600">
                  Basic Info
                </h4>
              </div>
              <p className="mb-4">
                <strong>Name : </strong> {name}
              </p>
              {submittedTime.current &&
                <p className="mb-4">
                  <strong>Submitted On:</strong> {format(new Date(submittedTime.current), 'dd/MM/yyyy hh:mm:ss a')}
                </p>
              }
              <p className="mb-4">
                <strong>Status:</strong>{" "}
                {parseFloat(TotalPassMarks.toFixed(2)) <= totalCorrectMarks
                  ? "Pass"
                  : "Fail"}
              </p>
            </div>
            <div>
              <ReactApexChart
                series={donutChart.series}
                options={donutChart.options}
                className="rounded-lg bg-white dark:bg-white overflow-hidden"
                type="donut"
                height={170}
              />
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-2xl text-cyan-600 font-bold  mb-4">
              Score Breakdown
            </h4>

            <div className="p-6 bg-white rounded-lg ">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="">
                      <th className="px-4 py-2 text-left text-cyan-600 text-lg font-bold">
                        Paper Name
                      </th>
                      <th className="px-4 py-2 text-left text-cyan-600 text-lg font-bold">
                        Total Marks
                      </th>
                      <th className="px-4 py-2 text-left text-cyan-600 text-lg font-bold">
                        Obtain Marks
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className=" border-t">
                      <td className="px-4 py-2 font-bold text-lg">
                        {MCQPaperName}
                      </td>
                      <td className="px-4 py-2 font-bold text-lg">
                        {TotalMarks}
                      </td>
                      <td className="px-4 py-2 font-bold text-lg">
                        {totalCorrectMarks}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto h-[80vh]">
            {question.map((q, index) => {
              const userAnswers: TblMasterMcqAnswer[] = []

              const correctAnswers: TblMasterMcqAnswer[] = []

              q.MCQOptions?.forEach((opt, i) => {
                if (opt.IsCorrect) {
                  correctAnswers.push({ ...opt, index: i })
                }
                selectedOptions.forEach((ans) => {
                  if (ans.MCQQuestionId === opt.MCQQuestionId) {
                    if (q.MCQQuestionType === 'One Word Answer') {
                      userAnswers.push({ ...ans, MCQOption: ans.OneWordAnswer, index: i })
                    } else {
                      if (ans.MCQOptionId === opt.MCQOptionId) {
                        userAnswers.push({ ...opt, index: i })
                      }
                    }
                  }
                })
              })

              const isCorrect = userAnswers.some((m) => m.IsCorrect === true);

              const questionMarks = calculateMarks.find(
                (m) => m.MCQQuestionId === q.MCQQuestionId
              )?.marks;

              return (
                <div key={q.MCQQuestionId} className="mb-4">
                  <div className="mb-2 p-2 border border-orange-400 rounded">
                    {index + 1}. <MathMLComp data={String(q.MCQQuestion)} />
                  </div>

                  <div className="mb-2 p-4 bg-gray-100 rounded-lg shadow-sm">
                    <p className="mb-2">
                      <strong className="text-cyan-600">Your Answer:</strong>{" "}
                      {userAnswers.length > 0 ? (
                        <span>
                          {q.MCQQuestionType === "One Word Answer"
                            ? userAnswers
                              .map((m) => String(m.MCQOption))
                              .join(", ")
                            : userAnswers
                              .map((m) => String.fromCharCode(65 + m.index!))
                              .join(", ")}
                        </span>
                      ) : (
                        <span className="text-gray-500">Not Attempted</span>
                      )}
                    </p>

                    <p className="mb-2">
                      <strong className="text-yellow-600">
                        Correct Answer:
                      </strong>{" "}
                      <span>
                        {q.MCQQuestionType === "One Word Answer"
                          ? correctAnswers
                            .map((m) => String(m.MCQOption))
                            .join(", ")
                          : correctAnswers
                            .map((m) => String.fromCharCode(65 + m.index!))
                            .join(", ")}
                      </span>
                      {/* {correctAnswers?.map((opt, index) => (
                      <p key={index}>
                        {String.fromCharCode(65 + opt.index)}
                      </p>
                    ))} */}
                    </p>

                    <p
                      className={isCorrect ? "text-green-600" : "text-red-600"}
                    >
                      <strong>Marks:</strong>{" "}
                      {typeof questionMarks === "number"
                        ? questionMarks.toFixed(2)
                        : "0.00"}
                    </p>

                    {!!q.AnswerExplanation &&
                      <div className="mt-2">
                        <b>Explanation:</b>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: q.AnswerExplanation }}></p>
                      </div>
                    }
                    <div className="mt-4">
                      {
                        !!q.AnswerLink &&
                        <Link to={q.AnswerLink} target="_blank" className="text-blue-600 py-2 px-4 border border-blue-500 rounded ">Explanation Link</Link>
                      }
                      {
                        !!q.AnswerDocumentUrl && <Link to={q.AnswerDocumentUrl} target="_blank" className="text-violet-600 hover:underline px-4 py-2">Explanation Attachment</Link>
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end p-2 gap-x-4">
            <button
              onClick={downloadCertificate}
              className="m-2 px-4 py-2 rounded-lg text-green-100 bg-amber-500 "
            >
              Download Certificate
            </button>
            <button
              onClick={downloadPdf}
              className="m-2 px-4 py-2 rounded-lg text-green-100 bg-green-500 "
            >
              Download Answers
            </button>
            <button className="m-2 px-4 py-2 bg-indigo-500 rounded-lg text-indigo-100" onClick={() => {
              dispatch(resetSelectedOptions())
              navigate('/mcq', { replace: true })
            }}>
              Save & Exit
            </button>
          </div>
        </div>

        {/* <div className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto h-[80vh]">
          {QuestionData.map((question: any, i: number) => (
            <div key={i}>
              <div className="mb-2 p-2 border border-orange-400">
                {" "}
                {i + 1} . <MathMLComp data={question.MCQQuestion} />:
              </div>

              <div className="mb-2 p-2 bg-gray-100 rounded-lg shadow-sm">
                <p>
                  <strong className="text-cyan-600">Your Answer:</strong>{" "}
                  {selectedOptions &&
                    selectedOptions.map((i, index) => (
                      <div key={index}>
                        <MathMLComp data={String(i.MCQOption)} />
                      </div>
                    ))}
                </p>
                <p>
                  <strong className="text-yellow-600">Correct Answer:</strong>{" "}
                  <MathMLComp data={question.answer.CorrectAnswer.join()} />
                </p>
                {question?.answer?.YourAnswer?.map((ans: any) =>
                  ans.toLowerCase()
                )
                  .sort()
                  .join(", ") ===
                question?.answer?.CorrectAnswer?.map((ans: any) =>
                  ans.toLowerCase()
                )
                  .sort()
                  .join(", ") ? (
                  <p className="text-green-600">
                    <strong>Marks:</strong> {question.MCQQuestionMarks}.00
                  </p>
                ) : (
                  <p className="text-red-600">
                    <strong>Marks:</strong> 0.00
                  </p>
                )}
              </div>
            </div>
          ))}
        </div> */}
        {/* <MathAndImageToPdf /> */}
      </div>
    </>
  );
};

export default MCQResultPage;
