import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDownloadCertificateMutation } from "../../Api/p2twebApi";
import { useFetchDbAnswersMutation, useGetMcqQuery, useSubmitExamMutation } from "../../Api/spAppApi";
import convertData from "../../Helper/ConvertData";
import ModalComp from "../../Helper/ModalComp";
import rtkErrorRead from "../../Helper/rtkErrorRead";
import { TblMasterMcqAnswer } from "../../interface/McqQuestion";
import { setSelectedMCQPaper } from "../../Store/Slice/DetailSlice";
import { loadInitialOptions, setSelectedPackageId } from "../../Store/Slice/McqSlice";
import IconBack from "../Icon/IconBack";
import MCQPage from "../Package/MCQPage";

const McqPaperPage = ({ packageId, mcqId, PaperType }: { packageId: any; mcqId: any, PaperType: string }) => {
  const dispatch = useDispatch()
  const [mcqPaperList, setMcqPaperList] = useState<any[]>([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [isBack, setIsBack] = useState<boolean>(false);

  const mcqPaperData = useGetMcqQuery({
    PackageId: packageId ? packageId : "",
  });
  const [dbAnsApi] = useFetchDbAnswersMutation()
  const [attemptApi] = useSubmitExamMutation()
  const [downloadCertificateApi, { isLoading: certificateLoading }] = useDownloadCertificateMutation()


  const formatTime = (time: string) => {
    const date = new Date(time);

    if (!date) {
      return "";
    }
    return format(date, 'dd-MM-yyyy hh:mm a');
  };

  useEffect(() => {
    if (mcqPaperData.isError) {
      rtkErrorRead(mcqPaperData.error);
    } else {
      const Paper = convertData(mcqPaperData?.data?.result);
      if (Paper && Paper.length > 0) {
        setMcqPaperList(Paper);
      }
    }
  }, [mcqPaperData]);

  const filteredMCQSets =
    mcqPaperList?.flatMap((set) =>
      set?.TblMasterMCQSet?.filter(
        (mcqSet: any) => mcqSet?.MCQSetId === mcqId
      ).flatMap((mcqSet: any) => mcqSet?.TblMasterMCQPaper || [])
    ) || [];



  const handleExamClick = (exam: any) => {
    dispatch(setSelectedMCQPaper({
      PaperType: PaperType,
      FromDate: exam?.FromDate,
      Instruction: exam?.Instruction,
      IsAnswerSheetShow: exam?.IsAnswerSheetShow,
      IsNegativeMark: exam?.IsNegativeMark,
      MCQPaperEndDate: exam?.MCQPaperEndDate,
      MCQPaperId: exam?.MCQPaperId,
      MCQPaperName: exam?.MCQPaperName,
      MCQPaperStartDate: exam?.MCQPaperStartDate,
      MCQSetId: exam?.MCQSetId,
      MCQStartTime: exam?.MCQStartTime,
      NoOfTotalQuestions: exam?.NoOfTotalQuestions,
      PaperDuration: exam?.PaperDuration,
      SortedOrder: exam?.SortedOrder,
      ToDate: exam?.ToDate,
      TotalMarks: exam?.TotalMarks,
      TotalPassMarks: exam?.TotalPassMarks,
    }));
    setSelectedExam(exam);

    setIsModalOpen(true);
  };

  const formatDuration = (sec: number) => {
    const h = Math.floor(sec / 3600);         // 1
    const m = Math.floor((sec % 3600) / 60);  // 1
    const s = sec % 60;                       // 11

    const formatted = `${h.toString().padStart(2, "0")}:${m.toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return formatted;
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };


  const handleAcceptAndStart = async () => {
    if (PaperType !== "QuickPractice") {
      const res = await dbAnsApi({
        MCQExamHistory: {
          MCQPaperId: selectedExam.MCQPaperId
        }
      })
      if (res.error) {
        rtkErrorRead(res.error)
      } else {
        const data = JSON.parse(res?.data?.result)

        if (typeof data === 'string' && data?.toLowerCase()?.includes('fresh exam')) {
          await attemptApi({
            MCQExamHistory: {
              ExamId: selectedExam.MCQPaperId,
              ExamType: PaperType,
              ExamName: selectedExam.MCQPaperName,
              ObtainMarks: 0,
              AttemptDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            }
          }).then(() => {
            dispatch(setSelectedPackageId(packageId))
            navigate("/mcqQuestion", {
              state: {
                packageId: packageId,
                MCQSetId: mcqId,
                duration: selectedExam.PaperDuration,
                MCQPaperId: selectedExam.MCQPaperId,
                IsNegativeMark: selectedExam.IsNegativeMark,
                SaveToDb: PaperType !== "QuickPractice",
              },
            });
          }).catch((err) => {
            rtkErrorRead(err)
          })
        } else {
          const { AttemptedQuestions, RemainingTime } = data[0]
          dispatch(setSelectedPackageId(packageId))
          if (!!AttemptedQuestions?.length) {
            const options: TblMasterMcqAnswer[] = []
            AttemptedQuestions?.forEach((question: any) => {
              question?.AnswerOptions?.forEach((ans: any) => {

                options.push({
                  IsCorrect: ans?.IsCorrect,
                  MCQOption: ans?.MCQOption,
                  MCQOptionId: ans?.MCQOptionId,
                  MCQPartialCorrectMarks: ans?.MCQPartialCorrectMarks,
                  MCQPartialNegativeMarks: ans?.MCQPartialNegativeMarks,
                  MCQQuestionId: question?.MCQQuestionId,
                  ... !!ans?.OneWordAnswer && { OneWordAnswer: ans?.OneWordAnswer }
                })
              })
            })
            dispatch(loadInitialOptions(options))

            navigate("/mcqQuestion", {
              state: {
                packageId: packageId,
                MCQSetId: mcqId,
                duration: RemainingTime ?? selectedExam.PaperDuration,
                MCQPaperId: selectedExam.MCQPaperId,
                IsNegativeMark: selectedExam.IsNegativeMark,
                SaveToDb: PaperType !== "QuickPractice",
              },
            });
          } else {
            navigate("/mcqQuestion", {
              state: {
                packageId: packageId,
                MCQSetId: mcqId,
                duration: selectedExam.PaperDuration,
                MCQPaperId: selectedExam.MCQPaperId,
                IsNegativeMark: selectedExam.IsNegativeMark,
                SaveToDb: PaperType !== "QuickPractice",
              },
            });
          }
        }
      }
    } else {
      dispatch(setSelectedPackageId(packageId))
      navigate("/mcqQuestion", {
        state: {
          packageId: packageId,
          MCQSetId: mcqId,
          duration: selectedExam.PaperDuration,
          MCQPaperId: selectedExam.MCQPaperId,
          IsNegativeMark: selectedExam.IsNegativeMark,
          SaveToDb: PaperType !== "QuickPractice",
        },
      });
    }
  };

  const handleBack = () => {
    setIsBack(true);
  };

  async function downloadCertificate(params: any) {
    const res = await downloadCertificateApi({
      PaperId: params.MCQPaperId,
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
      {isBack ? (
        <MCQPage isBack={isBack} packageId={packageId} />
      ) : (
        <section className="p-6">
          <button
            onClick={handleBack}
            title="Back to Mcq Series"
            className="bg-slate-800 rounded-lg px-3 py-2 text-slate-50 flex gap-x-2 items-center"
          >
            <IconBack className="text-slate-50" />
            Back
          </button>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMCQSets.length > 0 ? (
              filteredMCQSets.map((data: any) => (
                <div
                  key={data?.MCQPaperId}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105 border border-gray-200 p-5"
                >
                  {/* Image */}
                  <div className="w-full h-32 mb-4 flex items-center justify-center bg-white rounded-xl  shadow-sm">
                    <img
                      src="assets/images.png"
                      alt="paper"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2 text-sm">
                    {data?.MCQPaperName && (
                      <p className="text-gray-800 font-medium">
                        <span className="text-indigo-600 font-semibold">
                          Paper Name:
                        </span>{" "}
                        {data?.MCQPaperName}
                      </p>
                    )}

                    {data?.MCQPaperStartDate && (
                      <p className="text-gray-700 font-medium">
                        <span className="text-emerald-600 font-semibold">
                          Start Date:
                        </span>{" "}
                        {formatTime(data?.MCQPaperStartDate)}
                      </p>
                    )}

                    {data?.MCQPaperEndDate && (
                      <p className="text-gray-700 font-medium">
                        <span className="text-rose-500 font-semibold">
                          End Date:
                        </span>{" "}
                        {formatTime(data?.MCQPaperEndDate)}
                      </p>
                    )}

                    {data?.PaperDuration !== 0 && (
                      <p className="text-gray-700 font-medium">
                        <span className="text-yellow-600 font-semibold">
                          Duration:
                        </span>{" "}
                        {formatDuration(data?.PaperDuration)}
                      </p>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => handleExamClick(data)}
                      className="w-full text-center px-4 py-2 bg-[#043f72] text-white rounded-md font-semibold hover:bg-blue-700 transition duration-200"
                    >
                      View Question
                    </button>

                    <button
                      className="w-full text-center px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition duration-200 mt-2"
                      onClick={() => downloadCertificate(data)}
                      disabled={certificateLoading}
                    >
                      Download Certificate
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600">
                <img
                  src="assets/file-not-found-illustration-with-confused-people-holding-big-magnifier-search-no-result-data-not-found-concept-can-be-used-for-website-landing-page-animation-etc-vector.jpg"
                  alt="No records found"
                  className="w-2/3 md:w-1/2 h-auto mx-auto mb-6 rounded-xl shadow"
                />
                <p className="text-2xl font-semibold text-gray-700">
                  No Record Found
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <ModalComp
        sizeClass="max-w-4xl"
        title="Terms & Conditions ..."
        open={isModalOpen}
        closeBtnView={false}
        disabled={!isChecked}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAcceptAndStart}
      >
        <div className="mb-6 max-h-[400px]  overflow-y-auto">
          <div className="font-semibold mb-4">
            <div
              dangerouslySetInnerHTML={{
                __html: selectedExam?.Instruction,
              }}
              className="text-md font-semibold"
            />
          </div>
          <label className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="mb-2 mr-2"
            />

            <p className="text-green-800 mb-2 text-md font-bold">
              Please read and accept the terms and conditions before starting
              the exam.
            </p>
          </label>
          {selectedExam && (
            <div className="text-gray-700">
              <p className="font-bold">
                Selected Exam:{" "}
                <strong className="text-purple-600 text-lg">
                  {selectedExam.MCQPaperName}
                </strong>
              </p>
            </div>
          )}

        </div>
      </ModalComp>
    </>
  );
};

export default McqPaperPage;
