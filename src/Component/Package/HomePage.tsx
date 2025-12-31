import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleMcq = () => {
    navigate("/mcq");
  };
  const handleTest = () => {
    navigate("/test-series");
  };

  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <img
        src="assets\logi.png"
        alt="Test Series Illustration"
        className="w-80 pt-24"
      />

      <div className="flex mt-24">
        <div className="flex-1 flex justify-center items-center gap-4">
          <div className="text-center rounded-lg shadow-lg mt-4 border-2 border-slate-300 bg-gradient-to-br from-blue-50 to-blue-200 flex justify-center items-center flex-col p-4">
            <img
              src="assets\mcq-icon.png"
              alt="MCQ Illustration"
              className="w-48 h-64 "
            />
            <div className="my-4 text-md font-semibold italic">
              <p>Challenge your intellect with choices </p>
              <p>that define clarity amidst complexity...</p>
            </div>
            <button
              className="px-4 py-2 mb-4 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition-all"
              onClick={handleMcq}
            >
              MCQ Test
            </button>
          </div>

          <div className="text-center rounded-lg shadow-lg mt-4 border-2 border-slate-300 bg-slate-100 bg-gradient-to-br from-cyan-50 to-cyan-100 flex justify-center items-center flex-col p-4">
            <img
              src="assets\theory-icon.png"
              alt="Test Series Illustration"
              className="w-56 h-64"
            />
            <div className="my-4  text-md font-semibold italic">
              <p>Dive deep into the essence of understanding,</p>
              <p> where knowledge meets reflection...</p>
            </div>
            <button
              className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all"
              onClick={handleTest}
            >
              Test Series
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
