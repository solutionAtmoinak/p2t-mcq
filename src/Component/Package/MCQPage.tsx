import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useGetMcqQuery } from "../../Api/spAppApi";
import convertData from "../../Helper/ConvertData";
import rtkErrorRead from "../../Helper/rtkErrorRead";
import { setExamTypeTab, setSelectedPackage } from "../../Store/Slice/DetailSlice";
import { RootState } from "../../Store/Store";
import Certification from "../MCQ/Certification";
import Cohort from "../MCQ/Cohort";
import Comprehensive from "../MCQ/Comprehensive";
import OnlineRanked from "../MCQ/OnlineRanked";
import QuickPractice from "../MCQ/QuickPractice";
import PackageLayout from "./Package";

const ExamTypes = [
  { ExamType: "Quick Practice", ExamTypeTab: 0 },
  { ExamType: "Comprehensive Full Test", ExamTypeTab: 1 },
  { ExamType: "Online Ranked Competition", ExamTypeTab: 2 },
  { ExamType: "Certifications (MCQ)", ExamTypeTab: 3 },
  { ExamType: "Cohort", ExamTypeTab: 4 }
]

const MCQPage = ({
  isBack,
  packageId,
}: {
  isBack: boolean;
  packageId: number;
  selectedTab?: number;
}) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { state: lState } = location

  const [mcqList, setMcqList] = useState<any[]>([]);
  const [filterMcqList, setFilterMcqList] = useState<any[]>([]);
  const { selectedExamTypeTab: tab, selectedPackage } = useSelector((s: RootState) => s.detailed)

  const mcqApi = useGetMcqQuery({
    PackageId: selectedPackage?.PackageId || packageId,
  });

  useEffect(() => {
    if (!isNaN(Number(lState?.packageId))) {
      dispatch(setSelectedPackage({ PackageId: Number(lState.packageId) }))
    }
  }, [lState])


  useEffect(() => {
    if (mcqApi.isError) {
      rtkErrorRead(mcqApi.error);
    } else {
      const mcq = convertData(mcqApi?.data?.result);
      // console.log(mcq)
      if (mcq && mcq.length > 0) {
        setMcqList(mcq);
      }
    }
  }, [mcqApi]);

  useEffect(() => {
    if (!!lState) {
      const { examId } = lState;
      const exams = mcqList[0]?.TblMasterMCQSet || []
      if (!!examId && !!exams.length) {
        const exam = exams.find((e: any) => String(e.MCQSetId) === examId)
        if (!!exam) {
          const tabId = ExamTypes.find((et) => et.ExamType.toLowerCase().includes(exam?.ServicesTypeName?.toLowerCase()))?.ExamTypeTab
          if (tabId !== undefined) {
            dispatch(setExamTypeTab(tabId))
          }
          // console.log(exam, examId)
        }
      }
    }
  }, [lState, mcqList])


  useEffect(() => {
    filterListData(isBack ? tab : 0, mcqList[0]?.TblMasterMCQSet || []);
  }, [isBack, mcqList]);

  useEffect(() => {
    filterListData(tab, mcqList[0]?.TblMasterMCQSet || []);
  }, [tab, mcqList])




  function setTab(index: number) {
    if (index !== tab) {
      dispatch(setExamTypeTab(index))
    }
  }

  function filterListData(index: number, data: any[]) {

    switch (index) {
      case 0:
        setFilterMcqList(data?.filter((data: any) => data.ServicesTypeName?.toLowerCase().includes("quick practice")) || [])
        break;
      case 1:
        setFilterMcqList(data?.filter((data: any) => data.ServicesTypeName?.toLowerCase().includes("comprehensive")) || [])
        break;
      case 2:
        setFilterMcqList(data?.filter((data: any) => data.ServicesTypeName?.toLowerCase().includes("certification")) || [])
        break;
      case 3:
        setFilterMcqList(data?.filter((data: any) => data.ServicesTypeName?.toLowerCase().includes("online ranked")) || [])
        break;
      case 4:
        setFilterMcqList(data?.filter((data: any) => data.ServicesTypeName?.toLowerCase().includes("cohort")) || [])
        break;
      default:
        break;
    }
    setTab(index)

  }

  return (
    <>
      <div className="docs">
        <div className="w-full flex overflow-hidden max-h-screen">
          {!isBack && (
            <div className="col-span-1">
              <div className="h-screen">
                <PackageLayout />
              </div>
            </div>
          )}

          <div className="w-full">

            {!isBack && (
              <div className="flex flex-wrap gap-3 sticky top-0 z-10 p-4 text-center font-extrabold text-gray-800 mb-6 m-3 tracking-tight border-b pb-3 bg-white">

                {ExamTypes.map((data: any, index: number) => (
                  <button
                    key={`examType-${index}`}
                    className={`${tab === data.ExamTypeTab
                      ? "bg-[#043f72] text-white shadow-md font-semibold text-lg"
                      : "text-gray-500 hover:text-sky-600 hover:bg-sky-100"
                      }
                            px-4 py-2 rounded-md transition-all duration-200 ease-in-out
                            focus:outline-none focus-visible:ring-2
                            ltr:mr-2 rtl:ml-2 font-bold`}
                    onClick={() => setTab(data.ExamTypeTab)}
                  >
                    {data.ExamType}
                  </button>
                ))}
              </div>
            )}

            <div>
              {tab === 0 &&
                <QuickPractice
                  mcqList={filterMcqList}
                  packageId={selectedPackage?.PackageId || packageId}
                />
              }
              {tab === 1 &&
                <Comprehensive
                  mcqList={filterMcqList}
                  packageId={selectedPackage?.PackageId || packageId}
                />
              }
              {tab === 2 &&
                <OnlineRanked
                  mcqList={filterMcqList}
                  packageId={selectedPackage?.PackageId || packageId}
                />
              }
              {
                tab === 3 &&
                <Certification
                  mcqList={filterMcqList}
                  packageId={selectedPackage?.PackageId || packageId}
                />
              }
              {
                tab === 4 &&
                <Cohort
                  mcqList={filterMcqList}
                  packageId={selectedPackage?.PackageId || packageId}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};



export default MCQPage;
