import {useSelector} from "react-redux";
import {RootState} from "../../Store/Store";

const McqComponent = () => {
  // const selectedOptions = useSelector(
  //   (state: RootState) => state.mcqQuestion.selectedOptions
  // );

  // const question = useSelector(
  //   (state: RootState) => state.mcqQuestion.allQuestionSet
  // );

  const question2 = useSelector(
    (state: RootState) => state.mcqQuestion.mcqQuestionList
  );

  // const mcq = question2[0];

  const onClickedOption = () => {
    console.log("Selected options from store:", question2);
  };

  // const qp = question.map((m) => m.ServicesTypeName);

  // const onClickQuestions = () => {
  //   console.log("Selected Question from store:", question2);
  // };

  // const onClickQuestions2 = () => {
  //   console.log("Selected Question from store:", qp);
  // };

  return (
    <div>
      <button className="m-4 p-2 bg-blue-400" onClick={onClickedOption}>
        Result
      </button>

      {/* <button className="m-4 p-2 bg-blue-400" onClick={onClickQuestions}>
        for Questions
      </button> */}

      {/* <button className="m-4 p-2 bg-blue-400" onClick={onClickQuestions2}>
        gggg
      </button> */}

      {/* <button className="m-4 p-2 bg-blue-400" onClick={onClickQuestions}>
        Check quick practice
      </button> */}
    </div>
  );
};

export default McqComponent;
