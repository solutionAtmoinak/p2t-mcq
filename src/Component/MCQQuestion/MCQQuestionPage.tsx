import { Dialog, Transition } from "@headlessui/react";
import { format } from "date-fns";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetMcqQuery, useSubmitAnswerMutation } from "../../Api/spAppApi";
import convertData from "../../Helper/ConvertData";
import MathMLComp from "../../Helper/MathMlComp";
import rtkErrorRead from "../../Helper/rtkErrorRead";
import {
  TblMasterMcqAnswer,
  TblMasterMCQQuestion,
} from "../../interface/MCQQuestion";
import {
  setAllQuestionSet,
  setQuestionList,
  setSelectedOption
} from "../../Store/Slice/McqSlice";
import { RootState } from "../../Store/Store";
import DrawerComp from "../Common/DrawerComp";
import IconClock from "../Icon/IconClock";
import IconGrid from "../Icon/IconGrid";
import IconHelp from "../Icon/IconHelp";
import IconInstruction from "../Icon/IconInstruction";
import IconList from "../Icon/IconList";
import IconSad from "../Icon/IconSad";

const MCQQuestionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const examStartTime = useRef<string>(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));

  const { selectedMcqPaper } = useSelector((s: RootState) => s.detailed)
  const { mcqQuestionList: AllQusListRaw, selectedOptions } = useSelector((state: RootState) => state.mcqQuestion);




  const mcqQuestionsApi = useGetMcqQuery({
    PackageId: location.state.packageId ? location.state.packageId : "",
  });
  const [submitAnsApi] = useSubmitAnswerMutation()

  const [activeSection, setActiveSection] = useState<number>(0);
  const [mcqQusApiData, setMcqQusApiData] = useState<any[]>([]);
  const [remainingTime, setRemainingTime] = useState<number>(location.state.duration); // in sec
  const [qusTextList, setQueTextList] = useState<any>([]);
  const [selectedAnsWithCorrect, setSelectedAnsWithCorrect] = useState<any>([]);
  const [selectedAnswersText, setSelectedAnswersText] = useState<any[]>([]);
  const [answeredOptText, setAnsweredOptText] = useState<string[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(1);
  const [formattedTime, setFormattedTime] = useState<string>('');
  const [flatQusList, setFlatQusList] = useState<TblMasterMCQQuestion[]>([]);
  const [textInputAnswers, setTextInputAnswers] = useState<string[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<boolean[]>([]);
  const [sectionWiseQuestion, setSectionWiseQuestions] = useState<
    {
      sectionId: number;
      sectionName: string;
      questions: TblMasterMCQQuestion[];
    }[]
  >([]);

  const [openTimeEndModal, setOpenTimeEndModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "list">("grid");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isQuickPractice, setIsQuickPractice] = useState<boolean>(false);


  useEffect(() => {
    const preventRightClick = (event: MouseEvent) => {
      event.preventDefault();
    };
    window.addEventListener("contextmenu", preventRightClick);
    return () => {
      window.removeEventListener("contextmenu", preventRightClick);
    };
  }, []);

  useEffect(() => {
    if (!!!selectedMcqPaper?.MCQPaperId) {
      navigate('/mcq')
    }
  }, [selectedMcqPaper])


  useEffect(() => {
    if (mcqQuestionsApi.isError) {
      rtkErrorRead(mcqQuestionsApi.error);
    } else {
      const Question = convertData(mcqQuestionsApi?.data?.result);
      if (Question && Question.length > 0) {
        setMcqQusApiData(Question);
        // dispatch(resetSelectedOptions())
        // console.log(Question);
      }
    }
  }, [mcqQuestionsApi]);

  // console.log(AllQusListRaw[selectedQuestionIndex - 1]?.MCQOptions)


  useEffect(() => {
    if (mcqQusApiData) {
      const filteredMCQSets = mcqQusApiData
        ?.map((set) =>
          set?.TblMasterMCQSet?.filter(
            (mcqSet: any) => mcqSet.MCQSetId === location.state.MCQSetId
          )
        )
        .flat();

      const filteredPapers = filteredMCQSets
        ?.map((mcqSet: any) =>
          mcqSet?.TblMasterMCQPaper?.filter(
            (paper: any) => paper.MCQPaperId === location.state.MCQPaperId
          )
        )
        .flat();


      // Check if it's a Quick Practice
      if (filteredMCQSets[0]?.ServicesTypeName === "Quick Practice") {
        setIsQuickPractice(true);
      }

      // Collect section-wise questions
      const sectionWiseQuestions = filteredPapers
        ?.map((paper: any) =>
          paper?.TblMasterMCQSection?.map((section: any) => ({
            sectionId: section.MCQSectionId,
            sectionName: section.MCQSectionName,
            questions: section?.TblMasterMCQQuestion?.map(
              (question: TblMasterMCQQuestion) => ({
                MCQQuestion: question?.MCQQuestion,
                MCQQuestionId: question.MCQQuestionId,
              })
            ),
          }))
        )
        .flat();

      // Collect all MCQ options for questions
      const allMcqQuestions = filteredPapers
        ?.map((paper: any) =>
          paper?.TblMasterMCQSection?.map((section: any) =>
            section?.TblMasterMCQQuestion?.map((question: any) => question)
          ).flat()
        )
        .flat();

      // Collect all question lengths (questions without options)
      const allQuestionsLength = filteredPapers?.flatMap((paper: any) =>
        paper?.TblMasterMCQSection?.flatMap((section: any) =>
          section?.TblMasterMCQQuestion?.map(
            (question: any) => question.MCQQuestion
          )
        )
      );

      // console.log(
      //   allMcqQuestions,
      //   'allMcqQuestions'
      // )

      setQueTextList(allQuestionsLength);
      setSectionWiseQuestions(sectionWiseQuestions);
      setFlatQusList(allMcqQuestions);
      setAnsweredOptText(Array(allMcqQuestions.length).fill(""));
      setMarkedQuestions(Array(allMcqQuestions.length).fill(false));
      setTextInputAnswers(Array(allMcqQuestions.length).fill(""));
      dispatch(setQuestionList(allMcqQuestions));
      dispatch(setAllQuestionSet(filteredMCQSets));
    }
  }, [
    mcqQusApiData,
    location.state.MCQSetId,
    location.state.MCQPaperId,
  ]);


  useEffect(() => {
    // set previously saved answers
    const opt: any[] = []
    const optText: string[] = []
    const allOptions: any[] = [];
    const oneWords: string[] = []

    flatQusList.forEach((qus: any) => {
      const options = selectedOptions?.filter(
        (o: any) => o.MCQQuestionId === qus.MCQQuestionId
      );

      if (options.length === 0) {
        allOptions.push({})
        opt.push([])
        oneWords.push('')
        optText.push('')
      } else {
        let correct: boolean = false
        const text: string[] = []
        options.forEach((opt: any) => {
          correct = correct || opt.IsCorrect
          text.push(opt.MCQOption)
          optText.push(opt.MCQOption)
          oneWords.push(opt?.OneWordAnswer ?? '')
        })
        allOptions.push({ isCorrect: correct, options: text })
        opt.push(text)
      }
    });

    setSelectedAnswersText(allOptions)
    setSelectedAnsWithCorrect(opt)
    setAnsweredOptText(optText)
    setTextInputAnswers(oneWords)
  }, [flatQusList, selectedOptions])




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
      setOpenTimeEndModal(true)
    }; // seconds (i.e., 1 hour, 1 minute, 11 seconds)

    const h = Math.floor(remainingTime / 3600);         // 1
    const m = Math.floor((remainingTime % 3600) / 60);  // 1
    const s = remainingTime % 60;                       // 11

    const formatted = `${h.toString().padStart(2, "0")}:${m.toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

    setFormattedTime(formatted)
  }, [remainingTime])





  const handleOptionClick = (
    option: string,
    isMultiple: boolean,
    optionJson: TblMasterMcqAnswer,
  ) => {

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

    const question = flatQusList[selectedQuestionIndex - 1];

    const correctOptions = question?.MCQOptions?.filter(
      (opt: any) => opt.IsCorrect
    ).map((opt: any) => opt.MCQOption);

    const selectedOptions = updatedSelectedQuestions[selectedQuestionIndex - 1];
    const isCompleteSelection = selectedOptions.length >= (isMultiple ? 2 : 1);

    if (isCompleteSelection) {
      const isCorrect = selectedOptions.every((selectedOption: string) =>
        correctOptions?.includes(selectedOption)
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
    // setSelectedOption(selectedOptions);


    // console.log("setQList", qlist);
    // console.log("updatedQuestions", updatedQuestions);
  };

  const handleQuestionClick = (question: number) => {
    // console.log(question);
    setSelectedQuestionIndex(question);
    // setSelectedOption(answeredQuestions[question - 1] || null);
  };

  const handleNextClick = () => {
    if (selectedQuestionIndex < qusTextList.length) {
      const nextQuestionIndex = selectedQuestionIndex + 1;
      let newActiveSection = activeSection;
      let questionCounter = 0;

      for (let i = 0; i < sectionWiseQuestion.length; i++) {
        const sectionQuestions = sectionWiseQuestion[i].questions.length;
        if (nextQuestionIndex <= questionCounter + sectionQuestions) {
          newActiveSection = i;
          break;
        }
        questionCounter += sectionQuestions;
      }

      setActiveSection(newActiveSection);
      setSelectedQuestionIndex(nextQuestionIndex);

      const qusId = flatQusList[nextQuestionIndex - 2]?.MCQQuestionId;
      const options = selectedOptions.filter((opt: any) => opt.MCQQuestionId === qusId).map((opt: TblMasterMcqAnswer) => {
        return {
          MCQQuestionId: opt.MCQQuestionId,
          MCQOptionId: opt.MCQOptionId,
          MCQPaperId: location.state.MCQPaperId,
          IsCorrect: !!opt.IsCorrect,
          Marks: opt.MCQPartialCorrectMarks,
          OneWordAnswer: textInputAnswers[nextQuestionIndex - 2]
        }
      });

      // api call to save ans

      if (location.state.SaveToDb && Array.isArray(options)) {
        submitAnsApi({
          SpendedTime: location.state.duration - remainingTime,
          QuestionAnswerListofStudent: options
        }).then((res: any) => {
          console.log(res?.data?.result);
        }).catch((err) => {
          console.log(err);
        })

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
        const sectionQuestions = sectionWiseQuestion[i].questions.length;
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
  const handleMarkAsReview = () => {
    const updatedMarkedQuestions = [...markedQuestions];
    updatedMarkedQuestions[selectedQuestionIndex - 1] = true;
    setMarkedQuestions(updatedMarkedQuestions);
  };

  const handleRemoveMark = () => {
    const updatedMarkedQuestions = [...markedQuestions];
    updatedMarkedQuestions[selectedQuestionIndex - 1] = false;
    setMarkedQuestions(updatedMarkedQuestions);
  };

  const getClassForButton = (qus: number) => {
    const isAnswered =
      (answeredOptText[qus] && answeredOptText[qus].length > 0) ||
      (textInputAnswers[qus] && textInputAnswers[qus].length > 0);

    if (isAnswered && markedQuestions[qus]) {
      return "bg-gradient-to-r from-yellow-400 to-cyan-600 border-0";
    } else if (isAnswered) {
      return "bg-cyan-500 border-0";
    } else if (markedQuestions[qus]) {
      return "bg-yellow-500 border-0";
    } else {
      return "";
    }
  };

  // option color
  const getOptionColor = (option: any) => {
    const selectedAnswer = selectedAnswersText[selectedQuestionIndex - 1];
    // console.log("selectedAnswer", selectedAnswer);
    if (!selectedAnswer) return "border-2 border-orange-400";
    const selectedOptions = selectedAnswer.options;
    const correctOptions = flatQusList[
      selectedQuestionIndex - 1
    ]?.MCQOptions?.filter((opt: any) => opt.IsCorrect).map(
      (opt: any) => opt.MCQOption
    );
    const isCompleteSelection =
      selectedOptions?.length >=
      (flatQusList[selectedQuestionIndex - 1]?.IsMultipleCorrect
        ? 2
        : 1);
    if (isCompleteSelection) {
      if (selectedOptions.includes(option)) {
        const isCorrect = correctOptions?.includes(option);
        return isCorrect
          ? "bg-white border-4 border-green-400"
          : "bg-white border-4 border-red-500";
      }
      if (correctOptions?.includes(option)) {
        return "border-4 border-green-400";
      }
    }
    return "";
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
        setMarkedQuestions([]);
        setSelectedAnswersText([]);
      }
    })
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
      SpendedTime: location.state.duration - remainingTime
    };

    const filteredMCQSets = mcqQusApiData
      ?.map((set) =>
        set?.TblMasterMCQSet?.filter(
          (mcqSet: any) => mcqSet.MCQSetId === location.state.MCQSetId
        )
      )
      .flat();

    const filteredPapers = filteredMCQSets
      ?.map((mcqSet: any) =>
        mcqSet?.TblMasterMCQPaper?.filter(
          (paper: any) => paper.MCQPaperId === location.state.MCQPaperId
        )
      )
      .flat();

    resultData.MCQPaperName = filteredPapers[0].MCQPaperName;
    resultData.TotalMarks = filteredPapers[0].TotalMarks;
    resultData.TimeLeft = formattedTime,
      resultData.TotalPassMarks = filteredPapers[0].TotalPassMarks;

    textInputAnswers.forEach((t, i) => {
      if (!!t) {
        const qus = flatQusList[i];
        if (!qus.MCQOptions || qus.MCQOptions.length === 0) return;
        const isCorrect = qus.MCQOptions[0]?.MCQOption?.trim()?.toLowerCase() === t?.toLowerCase();
        const MCQOptionId = qus.MCQOptions[0]?.MCQOptionId;
        const MCQPartialCorrectMarks = qus.MCQOptions[0]?.MCQPartialCorrectMarks;
        const MCQPartialNegativeMarks = qus.MCQOptions[0]?.MCQPartialNegativeMarks;
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
          })
        );
      }
    })

    setOpenSubmitModal(false);

    navigate("/result", { state: { resultData: resultData, examStartTime: examStartTime.current, SaveToDb: location.state.SaveToDb } });
  };

  const handleCancel = () => {
    setOpenSubmitModal(false);
  };

  const handleInstruction = () => {
    setIsDrawerOpen(true);
  };

  const [oneWordSubmitter, set1WordSubmitter] = useState(false);

  function submitInputField(qus: TblMasterMCQQuestion) {
    if (qus.MCQQuestionType !== "One Word Answer") return;
    if (!qus.MCQOptions || qus.MCQOptions.length === 0) return;
    const isCorrect = qus.MCQOptions[0]?.MCQOption?.trim()?.toLowerCase() === textInputAnswers[selectedQuestionIndex - 1]?.toLowerCase();
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
      })
    );
    set1WordSubmitter(false);
    handleNextClick();
  }

  return (
    <>
      {/* <div>
        <McqComponent />
      </div> */}
      <div className="docs">
        <div className="flex h-[100vh] ">
          {/* Question and Image Section */}
          <div className="w-1/3 p-4 overflow-x-auto ">
            {/* 1 */}
            <div className="p-[2px] rounded-md shadow-md h-full flex flex-col justify-between">
              {/* 2 */}
              <div>
                <div className="flex justify-between p-2 ">
                  <h2 className="text-2xl font-bold">
                    {`${sectionWiseQuestion[activeSection]?.sectionName
                      } > Question ${selectedQuestionIndex -
                      sectionWiseQuestion
                        .slice(0, activeSection)
                        .reduce(
                          (total: any, section: any) =>
                            total + section.questions.length,
                          0
                        )
                      }`}
                  </h2>
                  {!isQuickPractice && (
                    <div className="flex justify-end items-center font-bold text-lg gap-3">
                      <IconClock />
                      {formattedTime}
                    </div>
                  )}
                </div>
                <hr />
                <div className="m-4 p-[2px] rounded-xl">
                  {flatQusList[selectedQuestionIndex - 1]
                    ?.PassageDetails && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            flatQusList[selectedQuestionIndex - 1]
                              ?.PassageDetails ?? "",
                        }}
                      ></div>
                    )}

                  <div className="rounded-xl p-0.5 shadow-lg text-gray-800 bg-gradient-to-r from-green-500 to-blue-200 m-2">
                    <div className="bg-white backdrop-blur-md rounded-lg p-4">
                      <MathMLComp
                        data={
                          flatQusList[selectedQuestionIndex - 1]
                            ?.MCQQuestion ?? ""
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  {flatQusList[selectedQuestionIndex - 1]
                    ?.MCQQuestionDocumentUrl && (
                      <>
                        {flatQusList[
                          selectedQuestionIndex - 1
                        ]?.MCQQuestionDocumentUrl?.match(
                          /\.(jpg|jpeg|png|gif|bmp)$/i
                        ) ? (
                          <div className="w-fit m-2 max-h-[40vh] overflow-y-auto mt-2 shadow rounded-md">
                            <img
                              src={
                                flatQusList[selectedQuestionIndex - 1]
                                  ?.MCQQuestionDocumentUrl
                              }
                              alt="Question Document"
                              className=""
                            />
                          </div>
                        ) : flatQusList[
                          selectedQuestionIndex - 1
                        ]?.MCQQuestionDocumentUrl?.match(
                          /\.(mp3|wav|ogg)$/i
                        ) ? (
                          <audio controls className="w-full mb-4 mt-[30px]">
                            <source
                              src={
                                flatQusList[selectedQuestionIndex - 1]
                                  ?.MCQQuestionDocumentUrl
                              }
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

                  {flatQusList[selectedQuestionIndex - 1]
                    ?.PassageDocumentUrl && (
                      <img
                        src={
                          flatQusList[selectedQuestionIndex - 1]
                            ?.PassageDocumentUrl
                        }
                        alt="Question Document"
                        className="w-[500px] h-[180px] mb-4 mt-[30px]"
                      />
                    )}
                  {flatQusList[selectedQuestionIndex - 1]
                    ?.MCQQuestionUrl && (
                      <>
                        {flatQusList[
                          selectedQuestionIndex - 1
                        ]?.MCQQuestionUrl?.includes("youtube.com") ||
                          flatQusList[
                            selectedQuestionIndex - 1
                          ]?.MCQQuestionUrl?.includes("youtu.be") ? (
                          <iframe
                            width="550"
                            height="320"
                            className="mb-4 mt-[30px]"
                            src={`https://www.youtube.com/embed/${flatQusList[
                              selectedQuestionIndex - 1
                            ]?.MCQQuestionUrl?.split("v=")[1]
                              }`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="MCQ Question Video"
                          ></iframe>
                        ) : (
                          <video
                            width="550"
                            height="320"
                            controls
                            className="mb-4 mt-[30px]"
                          >
                            <source
                              src={
                                flatQusList[selectedQuestionIndex - 1]
                                  ?.MCQQuestionUrl
                              }
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </>
                    )}
                </div>
              </div>
              {/* 3 */}
              <div className="mt-6 p-4 border-gray-300 bottom-0 pb-12">
                <hr />
                <h3 className="text-xl font-bold pt-4">User Guide</h3>
                <div className="flex gap-2 mt-4">
                  {/* Cyan color: Answered */}
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-cyan-400 rounded-full mr-2"></div>
                    <span className="font-semibold">Answered</span>
                  </div>

                  {/* Yellow color: Marked for Review */}
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="font-semibold">Marked for Review</span>
                  </div>
                  {/* Gradient color: Answered & Marked for Review */}
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400  to-cyan-600 border-0 rounded-full mr-2"></div>
                    <span className="font-semibold">
                      Answered & Marked for Review
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Options Section */}
          <div className="w-1/3 p-4">
            <div className="rounded-md flex flex-col justify-between shadow-md h-full">
              <div className="p-4">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-bold mb-4">Options</h2>
                  <button
                    className={`btn btn-sm btn-danger h-[30px]  bg-[#043f72] text-white hover:bg-sky-700 hover:text-white px-3 text-sm rounded-md ${!answeredOptText.length ? "cursor-not-allowed" : ""
                      }`}
                    onClick={handelResetAllSelectedQuestion}
                    disabled={!answeredOptText.length}
                  >
                    Reset
                  </button>
                </div>
                <hr />

                {/* wrong set */}

                <div className="grid grid-cols-1 gap-4 mt-6">
                  <p className="text-xl">
                    {flatQusList[selectedQuestionIndex - 1]
                      ?.IsMultipleCorrect
                      ? "This question may have more than one correct answer."
                      : null}
                  </p>
                  {flatQusList[selectedQuestionIndex - 1]
                    ?.MCQQuestionType === "One Word Answer" ? (
                    <>
                      <input
                        type="text"
                        placeholder="Enter One Word answer"
                        className="border p-2 rounded"
                        value={
                          textInputAnswers[selectedQuestionIndex - 1] || ""
                        }
                        onChange={(e) => {

                          setTextInputAnswers((prev) => prev.map((t, i) => {
                            if (i === selectedQuestionIndex - 1) {
                              return e.target.value?.trim()
                            } else {
                              return t
                            }
                          }))
                          set1WordSubmitter(true)
                        }}
                      />
                      {/* <button
                        onClick={() =>
                          submitInputField(
                            allQuestionDetails[selectedQuestionIndex - 1]
                          )
                        }
                        className="m-2 bg-green-300"
                      >
                        Submit
                      </button> */}
                    </>
                  ) : (
                    AllQusListRaw[selectedQuestionIndex - 1]?.MCQOptions?.map(
                      (option: TblMasterMcqAnswer, qus: any) => (
                        <button
                          key={qus}
                          className={`p-4 shadow rounded-md  
                        ${isQuickPractice
                              ? getOptionColor(option.MCQOption)
                              : " "
                            } 
                        ${Array.isArray(
                              selectedAnsWithCorrect[selectedQuestionIndex - 1]
                            ) &&
                              selectedAnsWithCorrect[selectedQuestionIndex - 1].includes(
                                option.MCQOption
                              )
                              ? "btn btn-dark border-4 border-green-400"
                              : AllQusListRaw[selectedQuestionIndex - 1] ===
                                option.MCQOption
                                ? "btn btn-dark border-0 bg-[#AA4A44]"
                                : ""
                            }`}
                          onClick={() =>
                            handleOptionClick(
                              option?.MCQOption ?? "",
                              !!flatQusList[selectedQuestionIndex - 1]
                                ?.IsMultipleCorrect,
                              option
                            )
                          }
                        >
                          {!!option.MCQOptionDocumentUrl ?
                            <div className="flex flex-col">
                              <div>
                                {String.fromCharCode(65 + qus)}.{" "}
                                <img src={option?.MCQOptionDocumentUrl} alt="mcq-option" />
                              </div>
                              <MathMLComp data={option?.MCQOption ?? ""} />
                            </div> :
                            <>
                              {String.fromCharCode(65 + qus)}.{" "}
                              <MathMLComp data={option?.MCQOption ?? ""} />
                            </>
                          }
                        </button>
                      )
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-20 p-8 rounded-lg shadow-md">
                <div className="flex flex-col gap-4">
                  <button
                    className={`w-[160px] h-[45px] text-white bg-[#043f72] rounded-md  hover:shadow-lg  ${selectedQuestionIndex === 1 ? "cursor-not-allowed" : ""
                      }`}
                    onClick={handlePreviousClick}
                    disabled={selectedQuestionIndex === 1}
                  >
                    ← Previous
                  </button>

                  <button className="hidden btn btn-secondary btn-sm h-[30px]">
                    Review
                  </button>
                </div>

                <button
                  className={`w-[160px] h-[45px] text-white bg-[#dd9207] border border-[#dd9207] rounded-md transition duration-200 ease-in-out hover:bg-[#c97f05] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#dd9207] ${selectedQuestionIndex === qusTextList.length
                    ? "cursor-not-allowed opacity-50"
                    : ""
                    }`}
                  onClick={() => {
                    if (oneWordSubmitter) {
                      submitInputField(
                        flatQusList[selectedQuestionIndex - 1]
                      );
                      set1WordSubmitter(false)
                    } else {
                      handleNextClick();
                    }
                  }}
                // disabled={selectedQuestionIndex === questionList.length}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="w-1/3 p-4">
            <div className="rounded-md flex flex-col justify-between shadow-md">
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold mb-4">Sections</h2>
                  {/* change this section */}

                  {/* <h2 className="text-2xl font-bold mb-4">Timer Here</h2>
                <Timer /> */}

                  {!isQuickPractice && (
                    <button
                      onClick={handleSubmitExam}
                      className="btn btn-primary w-[150px] h-[40px] border-2 border-green-800 text-green-800 hover:bg-green-800 hover:text-white rounded-md text-lg font-bold"
                    >
                      {" "}
                      Submit
                    </button>
                  )}
                </div>
                <hr />

                {/* Tabs for switching between Grid and List View */}
                <div className="flex mt-4 mb-6 justify-between">
                  {/* Left side: Grid and List View buttons */}
                  <div className="flex">
                    <button
                      className={`flex mr-4 p-2 rounded-md ${activeTab === "grid"
                        ? "border-2 text-black bg-red-100 border-orange-200"
                        : "bg-gray-200"
                        }`}
                      onClick={() => setActiveTab("grid")}
                    >
                      <IconGrid /> Grid View
                    </button>
                    <button
                      className={`flex p-2 rounded-md ${activeTab === "list"
                        ? "border-2 text-black bg-red-100 border-orange-200"
                        : "bg-gray-200"
                        }`}
                      onClick={() => setActiveTab("list")}
                    >
                      <IconList /> List View
                    </button>
                  </div>

                  {/* Right side: Help and Instruction buttons */}
                  <div className="flex gap-4">
                    <button className=" flex text-blue-500 hover:underline text-md font-semibold">
                      {" "}
                      <IconHelp />
                      Help
                    </button>
                    <button
                      className=" flex text-green-500 hover:underline text-md font-semibold"
                      onClick={handleInstruction}
                    >
                      {" "}
                      <IconInstruction />
                      Instruction
                    </button>
                  </div>
                </div>

                <div className="mt-6 max-h-[60vh] overflow-y-auto p-2">
                  {sectionWiseQuestion.map(
                    (section: any, sectionIndex: number) => (
                      <div key={section.sectionId} className="mb-6">
                        {/* Section Header */}
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-bold">
                            {section.sectionName} ({section?.questions?.length})
                          </h3>
                        </div>

                        <div>
                          {/* Switch between Grid and List View */}
                          {activeTab === "grid" ? (
                            // Grid View
                            <>
                              <div className="grid grid-cols-7 gap-1 mb-6">
                                {section?.questions?.map(
                                  (
                                    question: TblMasterMCQQuestion,
                                    questionIndex: number
                                  ) => {
                                    const questionNumber =
                                      flatQusList.findIndex(
                                        (id: TblMasterMCQQuestion) =>
                                          id.MCQQuestionId ===
                                          question.MCQQuestionId
                                      ) + 1;
                                    return (
                                      <button
                                        key={questionIndex}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                                      ${selectedQuestionIndex === questionNumber
                                            ? "bg-[#0482b5] text-white shadow-md scale-105 border-0"
                                            : getClassForButton(
                                              questionNumber - 1
                                            )
                                          }`}
                                        onClick={() => {
                                          setActiveSection(sectionIndex);
                                          handleQuestionClick(questionNumber);
                                        }}
                                      >
                                        {questionIndex + 1}
                                      </button>
                                    );
                                  }
                                )}
                              </div>

                              <hr />
                            </>
                          ) : (
                            // List View
                            <div className="space-y-2 overflow-y-scroll">
                              {section?.questions?.map(
                                (
                                  question: TblMasterMCQQuestion,
                                  questionIndex: number
                                ) => {
                                  const questionNumber =
                                    flatQusList.findIndex(
                                      (id: TblMasterMCQQuestion) =>
                                        id.MCQQuestionId ===
                                        question.MCQQuestionId
                                    ) + 1;

                                  return (
                                    <button
                                      key={questionIndex}
                                      className={`block border p-2 rounded-full text-center w-full ${selectedQuestionIndex === questionNumber
                                        ? "bg-[#0482b5] text-white border-0"
                                        : getClassForButton(
                                          questionNumber - 1
                                        )
                                        }`}
                                      onClick={() => {
                                        setActiveSection(sectionIndex);
                                        handleQuestionClick(questionNumber);
                                      }}
                                    >
                                      Question {questionIndex + 1}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-6 p-9 shadow-md">
                <button
                  type="button"
                  disabled={
                    markedQuestions[selectedQuestionIndex - 1] ||
                    answeredOptText[selectedQuestionIndex - 1] === ""
                  }
                  className={`w-[150px] min-h-[40px] text-black bg-[#a8dadc]  rounded-md transition duration-200 hover:bg-[#c97f05] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#dd9207] ${markedQuestions[selectedQuestionIndex - 1]
                    ? "cursor-not-allowed opacity-50"
                    : ""
                    }`}
                  onClick={handleMarkAsReview}
                >
                  Mark as Review
                </button>

                <button
                  type="button"
                  disabled={!markedQuestions[selectedQuestionIndex - 1]}
                  className={`w-[150px] min-h-[40px] text-white bg-[#1a476e] border border-[#043f72b7] rounded-md transition duration-200 hover:bg-[#032f59] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#043f72] ${!markedQuestions[selectedQuestionIndex - 1]
                    ? "cursor-not-allowed"
                    : ""
                    }`}
                  onClick={handleRemoveMark}
                >
                  Remove Mark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Time Expiry */}
        {!isQuickPractice && (
          <Transition appear show={openTimeEndModal} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={() => { }}
            >
              <div className="flex items-center justify-center min-h-screen p-4 text-center">
                <Dialog.Panel className="border-2 border-slate-4  00 bg-slate-100 max-w-sm p-6 mx-auto  rounded-lg shadow-xl transform transition-all duration-300 scale-95 hover:scale-100 animate-blink">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-semibold text-black mb-4"
                  >
                    <div className="flex justify-center mb-4 gap-4 ">
                      <IconSad />
                      <span className="font-bold">Time is Over</span>
                    </div>
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-lg text-black font-semibold">
                      Your time is over. Would you like to submit your test.
                    </p>
                  </div>
                  <div className="flex gap-6 mt-6 justify-center">
                    <button
                      type="button"
                      className="w-[150px] h-[45px] bg-blue-600 text-black rounded-lg font-medium shadow-lg transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      onClick={handleResultPage}
                    >
                      Submit
                    </button>

                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </Transition>
        )}

        {openSubmitModal && (
          <Transition appear show={openSubmitModal} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={() => { }}
            >
              <div className="flex items-center justify-center min-h-screen p-4 text-center">
                <Dialog.Panel className="border-2 border-slate-4  00 bg-slate-100  max-w-xl p-6 mx-auto  rounded-lg shadow-xl transform transition-all duration-300 scale-95 hover:scale-100 animate-blink">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold text-red-700 mb-4"
                  >
                    Ready to Submit?
                  </Dialog.Title>
                  <div className="text-lg text-black font-semibold">
                    <p className="mb-4">
                      Before you finish, double-check your answers! Are you sure
                      you want to submit your answer sheet?
                    </p>
                    <p className="italic text-sm text-red-700">
                      Once submitted, you cannot make any further changes.
                    </p>
                  </div>
                  <div className="flex  justify-center gap-6 mt-6">
                    <button
                      type="button"
                      className="w-[150px] h-[45px] border-2 border-green-500 text-black rounded-lg font-medium shadow-lg transition duration-200 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-gray-300"
                      onClick={handleResultPage}
                    >
                      Yes,Submit
                    </button>
                    <button
                      type="button"
                      className="w-[150px] h-[45px] border-2 border-red-500 text-black rounded-lg font-medium shadow-lg transition duration-200 hover:text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-gray-300"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </Transition>
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
                  __html: selectedMcqPaper?.Instruction ?? '',
                }}
              />
            </div>
          </>
        </DrawerComp>
      </div>
    </>
  );
};

export default MCQQuestionPage;
