import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "./Component/LoginPage/Login";
import TokenLogin from "./Component/LoginPage/TokenLogin";
import ThankYouPage from "./Component/MCQQuestion/ThankYouPage";
import HomePage from "./Component/Package/HomePage";
import TestSeriesPage from "./Component/Package/TestSeries";
import MCQPage2 from "./Component/MCQ/MCQPage2";
import PaperPage2 from "./Component/MCQPaper/PaperPage2";
import QuestionPage2 from "./Component/MCQQuestion/QuestionPage2";
import ResultPage2 from "./Component/MCQQuestion/ResultPage2";

// import MCQPage from "./Component/Package/MCQPage";
// import MCQResultPage from "./Component/MCQQuestion/MCQResultPage";
// import MCQQuestionPage from "./Component/MCQQuestion/MCQQuestionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} />
        {/* <Route path="/mcq" element={<MCQPage isBack={false} packageId={0} />} /> */}
        <Route path="/paper" element={<PaperPage2 />} />
        <Route path="/mcq" element={<MCQPage2 />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
        {/* <Route path="/mcqQuestion" element={<MCQQuestionPage />} /> */}
        <Route path="/mcqQuestion" element={<QuestionPage2 />} />
        <Route path="/test-series" element={<TestSeriesPage />} />
        {/* <Route path="/result" element={<MCQResultPage />} /> */}
        <Route path="/result" element={<ResultPage2 />} />
        <Route path="/:jwt" element={<TokenLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
