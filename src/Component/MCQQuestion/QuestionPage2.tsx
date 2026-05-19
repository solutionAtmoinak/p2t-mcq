import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { FaSave } from "react-icons/fa";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSubmitAnswerMutation } from "../../Api/spAppApi";
import MathMLComp from "../../Helper/MathMlComp";
import {
  TblMasterMcqAnswer,
  TblMasterMCQQuestion,
} from "../../interface/MCQQuestion";
import TblMasterMCQSection from "../../interface/MCQSection";
import { setQuestionList, setSelectedOption } from "../../Store/Slice/McqSlice";
import { RootState } from "../../Store/Store";
import DrawerComp from "../Common/DrawerComp";
import IconClock from "../Icon/IconClock";
import IconInstruction from "../Icon/IconInstruction";
import ExamSubmitModal from "./ExamSubmitModal";

const QuestionPage2: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const examStartTime = useRef<string>(
    format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  );

  const { selectedMcqPaper, selectedInternalService } = useSelector(
    (s: RootState) => s.detailed,
  );
  const { mcqQuestionList: AllQusListRaw, selectedOptions } = useSelector(
    (state: RootState) => state.mcqQuestion,
  );

  const [submitAnsApi] = useSubmitAnswerMutation();

  const [activeSection, setActiveSection] = useState<number>(0);
  // const [mcqQusApiData, setMcqQusApiData] = useState<any[]>([]);
  const [remainingTime, setRemainingTime] = useState<number>(
    location.state.duration,
  ); // in sec
  const [qusTextList, setQueTextList] = useState<any>([]);
  const [selectedAnsWithCorrect, setSelectedAnsWithCorrect] = useState<any>([]);
  const [selectedAnswersText, setSelectedAnswersText] = useState<any[]>([]);
  const [answeredOptText, setAnsweredOptText] = useState<string[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(1);
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [flatQusList, setFlatQusList] = useState<TblMasterMCQQuestion[]>([]);
  const [textInputAnswers, setTextInputAnswers] = useState<string[]>([]);
  // const [markedQuestions, setMarkedQuestions] = useState<boolean[]>([]);

  const [reviewQusId, setReviewQusId] = useState<number[]>([]);

  interface MCQSections {
    sectionId?: number;
    sectionName?: string;
    questions?: TblMasterMCQQuestion[];
  }
  const [sectionWiseQuestion, setSectionWiseQuestions] = useState<
    MCQSections[]
  >([]);

  const [openTimeEndModal, setOpenTimeEndModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isQuickPractice, setIsQuickPractice] = useState<boolean>(false);

  // useEffect(() => {
  //     const preventRightClick = (event: MouseEvent) => {
  //         event.preventDefault();
  //     };
  //     window.addEventListener("contextmenu", preventRightClick);
  //     return () => {
  //         window.removeEventListener("contextmenu", preventRightClick);
  //     };
  // }, []);

  useEffect(() => {
    if (!!!selectedMcqPaper?.MCQPaperId) {
      navigate("/mcq");
    } else {
      const sectionWiseQuestions =
        selectedMcqPaper?.TblMasterMCQSection?.map(
          (section: TblMasterMCQSection) => ({
            sectionId: section.MCQSectionId,
            sectionName: section.MCQSectionName,
            questions: section?.TblMasterMCQQuestion?.map(
              (q: TblMasterMCQQuestion) => q,
            ),
          }),
        ).flat() ?? [];

      // Collect all MCQ options for questions
      let allMcqQuestions: TblMasterMCQQuestion[] = [];
      selectedMcqPaper?.TblMasterMCQSection?.forEach(
        (s: TblMasterMCQSection) => {
          const qus = s?.TblMasterMCQQuestion;
          if (!!qus?.length) {
            allMcqQuestions = [...allMcqQuestions, ...qus];
          }
        },
      );

      // Collect all question lengths (questions without options)
      const allQuestionsLength = selectedMcqPaper?.TblMasterMCQSection?.flatMap(
        (s: any) =>
          s?.TblMasterMCQQuestion?.map(
            (q: TblMasterMCQQuestion) => q.MCQQuestion,
          ),
      );

      if (selectedInternalService?.ServicesTypeName === "Quick Practice") {
        setIsQuickPractice(true);
      }

      setQueTextList(allQuestionsLength);
      setSectionWiseQuestions(sectionWiseQuestions);
      setFlatQusList(allMcqQuestions);
      setAnsweredOptText(Array(allMcqQuestions.length).fill(""));
      // setMarkedQuestions(Array(allMcqQuestions.length).fill(false));
      setTextInputAnswers(Array(allMcqQuestions.length).fill(""));
      dispatch(setQuestionList(allMcqQuestions));
    }
  }, [selectedMcqPaper]);

  useEffect(() => {
    // set previously saved answers
    const opt: any[] = [];
    const optText: string[] = [];
    const allOptions: any[] = [];
    const oneWords: string[] = [];

    flatQusList.forEach((qus: any) => {
      const options = selectedOptions?.filter(
        (o: any) => o.MCQQuestionId === qus.MCQQuestionId,
      );

      if (options.length === 0) {
        allOptions.push({});
        opt.push([]);
        oneWords.push("");
        optText.push("");
      } else {
        let correct: boolean = false;
        const text: string[] = [];
        options.forEach((opt: any) => {
          correct = correct || opt.IsCorrect;
          text.push(opt.MCQOption);
          optText.push(opt.MCQOption);
          oneWords.push(opt?.OneWordAnswer ?? "");
        });
        allOptions.push({ isCorrect: correct, options: text });
        opt.push(text);
      }
    });

    setSelectedAnswersText(allOptions);
    setSelectedAnsWithCorrect(opt);
    setAnsweredOptText(optText);
    setTextInputAnswers(oneWords);
  }, [flatQusList, selectedOptions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (remainingTime === 0) {
      setOpenTimeEndModal(true);
    } // seconds (i.e., 1 hour, 1 minute, 11 seconds)

    const h = Math.floor(remainingTime / 3600); // 1
    const m = Math.floor((remainingTime % 3600) / 60); // 1
    const s = remainingTime % 60; // 11

    const formatted = `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

    setFormattedTime(formatted);
  }, [remainingTime]);

  const handleOptionClick = (args: {
    option: string;
    isMultiple: boolean;
    optionJson: TblMasterMcqAnswer;
  }) => {
    const { option, isMultiple, optionJson } = args;

    dispatch(setSelectedOption({ option: optionJson, IsMultiple: isMultiple }));

    // console.log("option and is multiple ", option);
    if (
      isQuickPractice &&
      !isMultiple &&
      answeredOptText[selectedQuestionIndex - 1]
    )
      return;

    const updatedSelectedQuestions = [...selectedAnsWithCorrect];

    if (isMultiple) {
      const currentOptions =
        updatedSelectedQuestions[selectedQuestionIndex - 1] || [];
      if (currentOptions.includes(option)) {
        const qus = currentOptions.indexOf(option);
        currentOptions.splice(qus, 1);
      } else {
        currentOptions.push(option);
      }

      updatedSelectedQuestions[selectedQuestionIndex - 1] = currentOptions;
    } else {
      updatedSelectedQuestions[selectedQuestionIndex - 1] = [option];
    }

    setSelectedAnsWithCorrect(updatedSelectedQuestions);
    setAnsweredOptText(updatedSelectedQuestions);

    const question = currQus;

    const correctOptions = question?.MCQOptions?.filter(
      (opt: any) => opt.IsCorrect,
    ).map((opt: any) => opt.MCQOption);

    const selectedOptions = updatedSelectedQuestions[selectedQuestionIndex - 1];
    const isCompleteSelection = selectedOptions.length >= (isMultiple ? 2 : 1);

    if (isCompleteSelection) {
      const isCorrect = selectedOptions.every((selectedOption: string) =>
        correctOptions?.includes(selectedOption),
      );
      setSelectedAnswersText((prev) => {
        const updatedAnswers = [...prev];
        updatedAnswers[selectedQuestionIndex - 1] = {
          options: selectedOptions,
          isCorrect,
        };
        return updatedAnswers;
      });
    } else {
      setSelectedAnswersText((prev) => {
        const updatedAnswers = [...prev];
        updatedAnswers[selectedQuestionIndex - 1] = {
          options: selectedOptions,
          isCorrect: null,
        };
        return updatedAnswers;
      });
    }
  };

  const handleQuestionClick = (question: number) => {
    setSelectedQuestionIndex(question);
  };

  const handleNextClick = () => {
    if (selectedQuestionIndex < qusTextList.length) {
      const nextQuestionIndex = selectedQuestionIndex + 1;
      let newActiveSection = activeSection;
      let questionCounter = 0;

      for (let i = 0; i < sectionWiseQuestion.length; i++) {
        const sectionQuestions =
          sectionWiseQuestion?.[i]?.questions?.length ?? 0;
        if (nextQuestionIndex <= questionCounter + sectionQuestions) {
          newActiveSection = i;
          break;
        }
        questionCounter += sectionQuestions;
      }

      setActiveSection(newActiveSection);
      setSelectedQuestionIndex(nextQuestionIndex);

      const qusId = flatQusList[nextQuestionIndex - 2]?.MCQQuestionId;
      const options = selectedOptions
        .filter((opt: any) => opt.MCQQuestionId === qusId)
        .map((opt: TblMasterMcqAnswer) => {
          return {
            MCQQuestionId: opt.MCQQuestionId,
            MCQOptionId: opt.MCQOptionId,
            MCQPaperId: location.state.MCQPaperId,
            IsCorrect: !!opt.IsCorrect,
            Marks: opt.MCQPartialCorrectMarks,
            OneWordAnswer: textInputAnswers[nextQuestionIndex - 2],
          };
        });

      // api call to save ans

      if (location.state.SaveToDb && Array.isArray(options)) {
        submitAnsApi({
          SpendedTime: location.state.duration - remainingTime,
          QuestionAnswerListofStudent: options,
        })
          .then((res: any) => {
            console.log(res?.data?.result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const handlePreviousClick = () => {
    // console.log(selectedQuestionIndex);
    if (selectedQuestionIndex > 1) {
      const previousQuestion = selectedQuestionIndex - 1;
      let newActiveSection = activeSection;
      let questionCounter = 0;

      for (let i = 0; i < sectionWiseQuestion.length; i++) {
        const sectionQuestions = sectionWiseQuestion[i]?.questions?.length ?? 0;
        if (previousQuestion <= questionCounter + sectionQuestions) {
          newActiveSection = i;
          break;
        }
        questionCounter += sectionQuestions;
      }

      setActiveSection(newActiveSection);
      setSelectedQuestionIndex(previousQuestion);
    }
  };

  const toggleQusReview = (qusId: number) => {
    const isMark = reviewQusId.includes(qusId);
    if (isMark) {
      setReviewQusId(reviewQusId.filter((id: number) => id !== qusId));
    } else {
      setReviewQusId([...reviewQusId, qusId]);
    }
  };

  const getClassQusIndex = (qusNo: number, qusId: number) => {
    const isAnswered =
      (answeredOptText[qusNo] && answeredOptText[qusNo].length > 0) ||
      (textInputAnswers[qusNo] && textInputAnswers[qusNo].length > 0);
    const isMarked = reviewQusId.includes(qusId);
    const isCurrent = selectedQuestionIndex - 1 === qusNo;

    const base = "h-12 w-12 font-semibold text-secondary-dark ";

    if (isAnswered && isMarked) {
      return base + "rounded-lg bg-primary shadow shadow-black";
    } else if (isAnswered) {
      return base + "bg-primary rounded-full";
    } else if (isMarked) {
      return base + "border-2 border-secondary rounded-lg";
    } else if (isCurrent) {
      return base + "border-2 border-primary rounded-full";
    } else {
      return base + "border border-secondary rounded-full";
    }
  };

  // option color
  const getOptionColor = (option: any): string => {
    let base = "px-6 py-4 shadow rounded-full ";

    if (isQuickPractice) {
      const selectedAnswer = selectedAnswersText[selectedQuestionIndex - 1];

      if (Object.keys(selectedAnswer ?? {}).length === 0)
        return base + "border-2 border-primary";
      const selectedOptions = selectedAnswer.options;
      const correctOptions = flatQusList[
        selectedQuestionIndex - 1
      ]?.MCQOptions?.filter((opt: any) => opt.IsCorrect).map(
        (opt: any) => opt.MCQOption,
      );
      const isCompleteSelection =
        selectedOptions?.length >= (currQus?.IsMultipleCorrect ? 2 : 1);
      if (isCompleteSelection) {
        if (selectedOptions.includes(option)) {
          const isCorrect = correctOptions?.includes(option);
          return isCorrect
            ? base + "bg-white border-4 border-green-400"
            : base + "bg-white border-4 border-red-500";
        }
        if (correctOptions?.includes(option)) {
          return base + "border-4 border-green-400";
        }
      }
      return base;
    } else {
      if (Array.isArray(selectedAnsWithCorrect[selectedQuestionIndex - 1])) {
        if (
          selectedAnsWithCorrect[selectedQuestionIndex - 1].includes(option)
        ) {
          return base + "bg-primary border-0";
        } else {
          if (AllQusListRaw[selectedQuestionIndex - 1] === option) {
            return base + "";
          } else {
            return base + "border-2 border-primary";
          }
        }
      } else {
        return base;
      }
    }
  };

  const handelResetAllSelectedQuestion = () => {
    Swal.fire({
      title: "Attention",
      icon: "warning",
      text: "Are you sure you want to reset all selected questions?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((ack) => {
      if (ack.isConfirmed) {
        setSelectedQuestionIndex(1);
        setSelectedAnsWithCorrect([]);
        setAnsweredOptText([]);
        setReviewQusId([]);
        setSelectedAnswersText([]);
      }
    });
  };

  const handleSubmitExam = () => {
    setOpenSubmitModal(true);
  };

  const handleResultPage = () => {
    const resultData = {
      MCQPaperName: "",
      TotalMarks: 0,
      TimeLeft: "",
      TotalPassMarks: 0,
      QuestionData: [],
      IsNegativeMark: location.state.IsNegativeMark,
      RemainingTime: remainingTime,
      SpendedTime: location.state.duration - remainingTime,
    };

    resultData.MCQPaperName = selectedMcqPaper.MCQPaperName ?? "";
    resultData.TotalMarks = selectedMcqPaper.TotalMarks ?? 0;
    ((resultData.TimeLeft = formattedTime),
      (resultData.TotalPassMarks = selectedMcqPaper.TotalPassMarks ?? 0));

    textInputAnswers.forEach((t, i) => {
      if (!!t) {
        const qus = flatQusList[i];
        if (!qus.MCQOptions || qus.MCQOptions.length === 0) return;
        const isCorrect =
          qus.MCQOptions[0]?.MCQOption?.trim()?.toLowerCase() ===
          t?.toLowerCase();
        const MCQOptionId = qus.MCQOptions[0]?.MCQOptionId;
        const MCQPartialCorrectMarks =
          qus.MCQOptions[0]?.MCQPartialCorrectMarks;
        const MCQPartialNegativeMarks =
          qus.MCQOptions[0]?.MCQPartialNegativeMarks;
        const MCQQuestionId = qus.MCQOptions[0]?.MCQQuestionId;

        dispatch(
          setSelectedOption({
            option: {
              IsCorrect: isCorrect,
              MCQOption: qus.MCQOptions[0]?.MCQOption,
              OneWordAnswer: t,
              MCQOptionId: MCQOptionId,
              MCQPartialCorrectMarks: MCQPartialCorrectMarks,
              MCQPartialNegativeMarks: MCQPartialNegativeMarks,
              MCQQuestionId: MCQQuestionId,
            },
            IsMultiple: false,
          }),
        );
      }
    });

    setOpenSubmitModal(false);

    navigate("/result", {
      state: {
        resultData: resultData,
        examStartTime: examStartTime.current,
        SaveToDb: location.state.SaveToDb,
      },
    });
  };

  const handleInstruction = () => {
    setIsDrawerOpen(true);
  };

  const [oneWordSubmitter, set1WordSubmitter] = useState(false);

  function submitInputField(qus: TblMasterMCQQuestion) {
    if (qus.MCQQuestionType !== "One Word Answer") return;
    if (!qus.MCQOptions || qus.MCQOptions.length === 0) return;
    const isCorrect =
      qus.MCQOptions[0]?.MCQOption?.trim()?.toLowerCase() ===
      textInputAnswers[selectedQuestionIndex - 1]?.toLowerCase();
    const MCQOption = textInputAnswers[selectedQuestionIndex - 1];
    const MCQOptionId = qus.MCQOptions[0]?.MCQOptionId;
    const MCQPartialCorrectMarks = qus.MCQOptions[0]?.MCQPartialCorrectMarks;
    const MCQPartialNegativeMarks = qus.MCQOptions[0]?.MCQPartialNegativeMarks;
    const MCQQuestionId = qus.MCQOptions[0]?.MCQQuestionId;

    dispatch(
      setSelectedOption({
        option: {
          IsCorrect: isCorrect,
          MCQOption: MCQOption,
          MCQOptionId: MCQOptionId,
          MCQPartialCorrectMarks: MCQPartialCorrectMarks,
          MCQPartialNegativeMarks: MCQPartialNegativeMarks,
          MCQQuestionId: MCQQuestionId,
        },
        IsMultiple: false,
      }),
    );
    set1WordSubmitter(false);
    handleNextClick();
  }

  const currQus = flatQusList[selectedQuestionIndex - 1];

  return (
    <div className="docs">
      <div className="flex flex-col xl:flex-row min-h-screen xl:h-screen overflow-y-auto xl:overflow-hidden">
        {/* Question Section */}
        <div className="w-full xl:w-1/3 p-3 sm:p-4 overflow-visible xl:overflow-x-auto">
          <div className="p-[2px] rounded-md shadow-md h-full flex flex-col justify-between bg-slate-100">
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2">
                <h2 className="text-lg sm:text-xl xl:text-2xl font-bold text-secondary break-words">
                  {`${
                    sectionWiseQuestion[activeSection]?.sectionName
                  } > Question ${
                    selectedQuestionIndex -
                    sectionWiseQuestion
                      .slice(0, activeSection)
                      .reduce(
                        (total: any, section: any) =>
                          total + section.questions.length,
                        0,
                      )
                  }`}
                </h2>

                {!isQuickPractice && (
                  <div className="flex items-center font-bold text-sm sm:text-base xl:text-lg gap-2 sm:gap-3">
                    <IconClock />
                    {formattedTime}
                  </div>
                )}
              </div>

              <hr />

              <div className="m-3 sm:m-4 p-3 sm:p-4 rounded-xl bg-white">
                {currQus?.PassageDetails && (
                  <div
                    className="mb-2 text-sm sm:text-base break-words"
                    dangerouslySetInnerHTML={{
                      __html: currQus?.PassageDetails ?? "",
                    }}
                  />
                )}

                <div className="rounded-xl text-secondary-dark text-sm sm:text-base break-words">
                  <MathMLComp data={currQus?.MCQQuestion ?? ""} />
                </div>
              </div>

              <div className="flex justify-center mt-2 p-3 sm:p-4">
                {currQus?.MCQQuestionDocumentUrl && (
                  <>
                    {currQus?.MCQQuestionDocumentUrl?.match(
                      /\.(jpg|jpeg|png|gif|bmp)$/i,
                    ) ? (
                      <div className="w-full max-w-full m-2 max-h-[40vh] overflow-y-auto mt-2 shadow rounded-md">
                        <img
                          src={currQus?.MCQQuestionDocumentUrl}
                          alt="Question Document"
                          className="max-w-full h-auto"
                        />
                      </div>
                    ) : currQus?.MCQQuestionDocumentUrl?.match(
                        /\.(mp3|wav|ogg)$/i,
                      ) ? (
                      <audio controls className="w-full mb-4 mt-[30px]">
                        <source
                          src={currQus?.MCQQuestionDocumentUrl}
                          type={`audio/${flatQusList[
                            selectedQuestionIndex - 1
                          ]?.MCQQuestionDocumentUrl?.split(".").pop()}`}
                        />
                        Your browser does not support the audio tag.
                      </audio>
                    ) : (
                      <p className="text-gray-500 italic">
                        Unsupported media type.
                      </p>
                    )}
                  </>
                )}

                {currQus?.PassageDocumentUrl && (
                  <img
                    src={currQus?.PassageDocumentUrl}
                    alt="Question Document"
                    className="w-full max-w-[500px] h-auto mb-4 mt-[30px]"
                  />
                )}

                {currQus?.MCQQuestionUrl && (
                  <>
                    {currQus?.MCQQuestionUrl?.includes("youtube.com") ||
                    currQus?.MCQQuestionUrl?.includes("youtube.be") ? (
                      <iframe
                        className="w-full max-w-[550px] aspect-video mb-4 mt-[30px]"
                        src={currQus?.MCQQuestionUrl}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="MCQ Question Video"
                      />
                    ) : (
                      <video
                        controls
                        className="w-full max-w-[550px] aspect-video mb-4 mt-[30px]"
                      >
                        <source
                          src={currQus?.MCQQuestionUrl}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Options Section */}
        <div className="w-full xl:w-1/3 p-3 sm:p-4">
          <div className="rounded-md flex flex-col justify-between shadow-md min-h-[520px] xl:h-full bg-white">
            <div className="p-3 sm:p-4">
              <div className="flex justify-between items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Options</h2>

                <button
                  className={`btn btn-sm btn-danger h-[30px] bg-[#043f72] text-white hover:bg-sky-700 hover:text-white px-3 text-sm rounded-md ${
                    !answeredOptText.length ? "cursor-not-allowed" : ""
                  }`}
                  onClick={handelResetAllSelectedQuestion}
                  disabled={!answeredOptText.length}
                >
                  Reset
                </button>
              </div>

              <hr />

              <div className="grid grid-cols-1 gap-4 mt-6">
                <p className="text-base sm:text-xl">
                  {currQus?.IsMultipleCorrect
                    ? "This question may have more than one correct answer."
                    : null}
                </p>

                {currQus?.MCQQuestionType === "One Word Answer" ? (
                  <input
                    type="text"
                    placeholder="Enter One Word answer"
                    className="border p-3 rounded w-full"
                    value={textInputAnswers[selectedQuestionIndex - 1] || ""}
                    onChange={(e) => {
                      setTextInputAnswers((prev) =>
                        prev.map((t, i) => {
                          if (i === selectedQuestionIndex - 1) {
                            return e.target.value?.trim();
                          } else {
                            return t;
                          }
                        }),
                      );
                      set1WordSubmitter(true);
                    }}
                  />
                ) : (
                  AllQusListRaw[selectedQuestionIndex - 1]?.MCQOptions?.map(
                    (option: TblMasterMcqAnswer, qus: any) => (
                      <button
                        key={`option-${option.MCQOptionId}`}
                        className={getOptionColor(option.MCQOption)}
                        onClick={() =>
                          handleOptionClick({
                            option: option?.MCQOption ?? "",
                            isMultiple: !!currQus?.IsMultipleCorrect,
                            optionJson: option,
                          })
                        }
                      >
                        {!!option.MCQOptionDocumentUrl ? (
                          <div className="flex flex-col w-full">
                            <div className="flex flex-col sm:flex-row items-center gap-2 w-full justify-center mb-2">
                              <b>{String.fromCharCode(65 + qus)}. </b>
                              <img
                                src={option?.MCQOptionDocumentUrl}
                                alt="mcq-option"
                                className="max-w-full h-auto"
                              />
                            </div>
                            <MathMLComp data={option?.MCQOption ?? ""} />
                          </div>
                        ) : (
                          <span className="block w-full">
                            <b>{String.fromCharCode(65 + qus)}. </b>
                            <MathMLComp data={option?.MCQOption ?? ""} />
                          </span>
                        )}
                      </button>
                    ),
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-8 xl:mt-20 p-4 sm:p-6 xl:p-8 rounded-lg shadow-md">
              <button
                className="btn-secondary w-full sm:w-auto"
                onClick={handlePreviousClick}
                disabled={selectedQuestionIndex === 1}
              >
                <GrLinkPrevious />
                Previous
              </button>

              <button
                className="btn-primary w-full sm:w-auto"
                disabled={selectedQuestionIndex === qusTextList.length}
                onClick={() => {
                  if (oneWordSubmitter) {
                    submitInputField(currQus);
                    set1WordSubmitter(false);
                  } else {
                    handleNextClick();
                  }
                }}
              >
                Next
                <GrLinkNext />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="w-full xl:w-1/3 p-3 sm:p-4">
          <div className="rounded-md flex flex-col justify-between shadow-md bg-white">
            <div className="p-3 sm:p-4">
              <div className="flex flex-row justify-between items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
                  Sections
                </h2>

                {!isQuickPractice && (
                  <button
                    onClick={handleSubmitExam}
                    className="btn-primary w-auto mb-3"
                  >
                    <FaSave />
                    Submit
                  </button>
                )}
              </div>

              <hr />

              <div className="mt-6 max-h-[52vh] overflow-y-auto p-2">
                {sectionWiseQuestion.map((s: MCQSections, si: number) => (
                  <div key={`section-${s.sectionId}`} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-base sm:text-lg font-bold">
                        {s.sectionName} ({s?.questions?.length})
                      </h3>
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3 xl:gap-4 mb-6">
                      {s?.questions?.map(
                        (q: TblMasterMCQQuestion, qi: number) => {
                          const questionNumber = flatQusList.findIndex(
                            (id: TblMasterMCQQuestion) =>
                              id.MCQQuestionId === q.MCQQuestionId,
                          );

                          return (
                            <button
                              key={`qusOpt-${si}-${qi}`}
                              className={getClassQusIndex(
                                questionNumber,
                                Number(q.MCQQuestionId),
                              )}
                              onClick={() => {
                                setActiveSection(si);
                                handleQuestionClick(questionNumber + 1);
                              }}
                            >
                              {qi + 1}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <hr />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6 shadow-md p-4 justify-between">
              <button
                type="button"
                className={`${
                  reviewQusId.includes(Number(currQus?.MCQQuestionId ?? 0))
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground"
                } px-3 py-2 rounded-lg w-full sm:w-auto`}
                onClick={() =>
                  toggleQusReview(Number(currQus?.MCQQuestionId ?? 0))
                }
              >
                {reviewQusId.includes(Number(currQus?.MCQQuestionId ?? 0))
                  ? "Remove Mark"
                  : "Mark as Review"}
              </button>

              <button
                className="flex justify-center sm:justify-start text-green-500 hover:underline text-sm sm:text-md font-semibold items-center gap-2"
                onClick={handleInstruction}
              >
                <IconInstruction />
                Instruction
              </button>
            </div>
             <QusLegend />
          </div>
        </div>
      </div>

      {!isQuickPractice && (
        <ExamSubmitModal
          open={openTimeEndModal}
          onClose={() => setOpenTimeEndModal(false)}
          onSubmit={handleResultPage}
          isTimeEnd={true}
        />
      )}

      {openSubmitModal && (
        <ExamSubmitModal
          open={openSubmitModal}
          onClose={() => setOpenSubmitModal(false)}
          onSubmit={handleResultPage}
          isTimeEnd={false}
        />
      )}

      <DrawerComp
        title="Instruction"
        open={isDrawerOpen}
        headerClassName="text-2xl"
        onClose={() => setIsDrawerOpen(false)}
        style={{
          width: window.screen.width > 1024 ? "33%" : "100%",
        }}
      >
        <>
          <div className="flex flex-wrap gap-2">
            <div
              className="font-bold text-lg"
              dangerouslySetInnerHTML={{
                __html: selectedMcqPaper?.Instruction ?? "",
              }}
            />
          </div>
        </>
      </DrawerComp>
    </div>
  );
};

const QusLegend = () => {
  return (
    <div className="mt-auto w-full">
      <hr />
      <h3 className="text-xl font-bold pt-4 px-4">User Guide</h3>
      <div className="grid 2xl:grid-cols-4 grid-cols-2 gap-4 p-4 w-full text-center">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 border border-secondary rounded-full mb-2"></div>
          <span className="text-xs">Unanswered</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-6 h-6 bg-primary rounded-full mb-2"></div>
          <span className="text-xs">Answered</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-6 h-6 border border-secondary rounded-lg mb-2"></div>
          <span className="text-xs max-w-[150px]">Marked for review</span>
        </div>

        {/* Gradient color: Answered & Marked for Review */}
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-lg bg-primary shadow shadow-black mb-2"></div>
          <span className="text-xs max-w-[150px]">
            Answered & Marked for Review
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage2;
