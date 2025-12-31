import { useState } from "react";
import McqPaperPage from "../MCQPaper/McqPaperPage";

const Certification = ({ mcqList, packageId }: { mcqList: any, packageId: any }) => {

  const [isPaper, setIsPaper] = useState<boolean>(false)
  const [mcqId, setMcqId] = useState<any>('')



  const handleExamClick = (exam: any) => {
    setIsPaper(true)
    setMcqId(exam)
    // navigate('/mcq-paper', { state: { packageId: packageId ,MCQSetId: exam.MCQSetId } });
  };


  return (
    <>
      {isPaper ?
        <McqPaperPage packageId={packageId} mcqId={mcqId} PaperType="Certification" />
        :
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 pl-20 mr-8">
          {mcqList.length > 0 ? (
            mcqList.map((data: any) => (
              <div
                key={data.MCQSetId}
                onClick={() => handleExamClick(data?.MCQSetId)}
                className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer flex flex-col items-center p-6"
              >
                <img
                  src="assets/png-transparent-computer-icons-test-survey-miscellaneous-angle-text-thumbnail.png"
                  alt={`Thumbnail for ${data.MCQSetName}`}
                  className="w-32 h-32 object-contain rounded-full mb-6"
                />
                <p className="text-lg font-bold text-center text-gray-800">
                  {data.MCQSetName}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 font-semibold">
              <img
                src="assets/file-not-found-illustration-with-confused-people-holding-big-magnifier-search-no-result-data-not-found-concept-can-be-used-for-website-landing-page-animation-etc-vector.jpg"
                alt="no records"
                className="w-8/12 h-auto mx-auto mb-4" />
              <p className="text-4xl font-bold">No Record Found</p>
            </div>

          )}
        </div>
      }
    </>
  );
};

export default Certification;
