line number 239
// console.log("Dispatching question list:", sectionWiseQuestion);
create a redux store for three sections [{}, {}, {}]

const getOptionColor = (option: string) => {
const selectedAnswer = selectedAnswers[selectedQuestionIndex - 1];

    if (!selectedAnswer) return "border-2 border-orange-400";

    const selectedOptions = selectedAnswer.options;
    const correctOptions = allQuestionDetails[
      selectedQuestionIndex - 1
    ]?.MCQOptions?.filter((opt: any) => opt.IsCorrect).map(
      (opt: any) => opt.MCQOption
    );

    const isCompleteSelection =
      selectedOptions.length >=
      (allQuestionDetails[selectedQuestionIndex - 1]?.IsMultipleCorrect
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

change color state correctly

manage via redux store
will be very help full

<!-- 
allQuestionDetails[selectedQuestionIndex - 1] is equals to the question number like question 1
all question 20 array


 -->

 <!-- option {MCQOptionId: 3917, MCQOption: '4', MCQQuestionId: 1149, MCQPartialCorrectMarks: 0, MCQPartialNegativeMarks: 1, …} -->

 this is option in getColor querry try to change it to the querry