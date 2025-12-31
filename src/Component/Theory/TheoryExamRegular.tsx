const TheoryExamRegular = ({TheoryList}: {TheoryList: any}) => {
  // Filter and flatten the data
  const filteredTheoryExams =
    TheoryList[0]?.setpackage
      ?.flatMap((packageItem: any) =>
        packageItem.examset.filter(
          (exam: any) => exam.ServicesTypeName === "Theory Exam"
        )
      )
      ?.flatMap((exam: any) => exam.theoryexam) || [];

  return (
    <div className="h-[85vh]  p-10 shadow-sm">
      {filteredTheoryExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {filteredTheoryExams.map((theoryExam: any) => (
            <div
              key={theoryExam.TheoryExamId}
              className="flex-shrink-0 text-center"
            >
              <img
                src="assets/png-transparent-computer-icons-test-survey-miscellaneous-angle-text-thumbnail.png"
                alt={theoryExam.TheoryExamName}
                className="w-64 h-64 rounded-full"
              />
              <p className="mt-2 text-gray-700 font-semibold">
                {theoryExam.TheoryExamName}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <img
            src="assets/file-not-found-illustration-with-confused-people-holding-big-magnifier-search-no-result-data-not-found-concept-can-be-used-for-website-landing-page-animation-etc-vector.jpg"
            alt="No Records Found"
            className="w-9/12 h-auto mb-4"
          />
          <p className="text-gray-500 font-semibold text-lg">
            No records found
          </p>
        </div>
      )}
    </div>
  );
};

export default TheoryExamRegular;
