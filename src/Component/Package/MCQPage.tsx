import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMcqQuery } from "../../Api/spAppApi";
import convertData from "../../Helper/ConvertData";
import rtkErrorRead from "../../Helper/rtkErrorRead";
import { setExamTypeTab } from "../../Store/Slice/DetailSlice";
import { RootState } from "../../Store/Store";
import Certification from "../MCQ/Certification";
import Comprehensive from "../MCQ/Comprehensive";
import OnlineRanked from "../MCQ/OnlineRanked";
import QuickPractice from "../MCQ/QuickPractice";
import PackageLayout from "./Package";
import Cohort from "../MCQ/Cohort";

const MCQPage = ({
  isBack,
  packageId,
}: {
  isBack: boolean;
  packageId: number;
  selectedTab?: number;
}) => {
  const dispatch = useDispatch()
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [mcqList, setMcqList] = useState<any[]>([]);
  const [filterMcqList, setFilterMcqList] = useState<any[]>([]);
  const { selectedExamTypeTab: tab } = useSelector((s: RootState) => s.detailed)

  const mcqApi = useGetMcqQuery({
    PackageId: selectedPackage?.PackageId || packageId,
  });

  function setTab(index: number) {
    if (index !== tab) {
      dispatch(setExamTypeTab(index))
    }
  }

  useEffect(() => {
    if (mcqApi.isError) {
      rtkErrorRead(mcqApi.data);
    } else {
      const mcq = convertData(mcqApi?.data?.result);
      // console.log(mcq)
      if (mcq && mcq.length > 0) {
        setMcqList(mcq);
      }
    }
  }, [mcqApi]);

  useEffect(() => {
    filterListData(isBack ? tab : 0, mcqList[0]?.TblMasterMCQSet || []);
  }, [isBack, mcqList]);

  useEffect(() => {
    filterListData(tab, mcqList[0]?.TblMasterMCQSet || []);
  }, [tab, mcqList])


  const handlePackageSelect = (pkg: any) => {
    setSelectedPackage(pkg);
  };

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
                <PackageLayout onPackageSelect={handlePackageSelect} />
              </div>
            </div>
          )}

          <div className="w-full">

            {!isBack && (
              <div className="flex flex-wrap gap-3 sticky top-0 z-10 p-4 text-center font-extrabold text-gray-800 mb-6 m-3 tracking-tight border-b pb-3 bg-white">

                <button
                  className={`${tab === 0
                    ? "bg-[#043f72] text-white shadow-md font-semibold text-lg"
                    : "text-gray-500 hover:text-sky-600 hover:bg-sky-100"
                    }
                          px-4 py-2 rounded-md transition-all duration-200 ease-in-out
                          focus:outline-none focus-visible:ring-2
                          ltr:mr-2 rtl:ml-2 font-bold`}
                  onClick={() => setTab(0)}
                >
                  Quick Practice
                  {/* {filteredMCQs.length} */}
                </button>


                <button
                  className={`${tab === 1
                    ? "bg-[#043f72] text-white shadow-md font-semibold text-lg"
                    : "text-gray-500 hover:text-sky-600 hover:bg-sky-100"
                    }
                          px-4 py-2 rounded-md transition-all duration-200 ease-in-out
                          focus:outline-none focus-visible:ring-2
                          ltr:mr-2 rtl:ml-2 font-bold`}
                  onClick={() => setTab(1)}
                >
                  Comprehensive Full Test
                </button>


                <button
                  className={`${tab === 2
                    ? "bg-[#043f72] text-white shadow-md font-semibold text-lg"
                    : "text-gray-500 hover:text-sky-600 hover:bg-sky-100"
                    }
                      px-4 py-2 rounded-md transition-all duration-200 ease-in-out
                      focus:outline-none focus-visible:ring-2
                      ltr:mr-2 rtl:ml-2 font-bold`}
                  onClick={() => setTab(2)}
                >
                  Online Ranked Competition
                </button>

                <button
                  className={`${tab === 3
                    ? "bg-[#043f72] text-white shadow-md font-semibold text-lg"
                    : "text-gray-500 hover:text-sky-600 hover:bg-sky-100"
                    }
                      px-4 py-2 rounded-md transition-all duration-200 ease-in-out
                      focus:outline-none focus-visible:ring-2
                      ltr:mr-2 rtl:ml-2 font-bold`}
                  onClick={() => setTab(3)}
                >
                  Certifications(MCQ)
                </button>

                <button
                  className={`${tab === 4
                    ? "bg-[#043f72] text-white shadow-md font-semibold text-lg"
                    : "text-gray-500 hover:text-sky-600 hover:bg-sky-100"
                    }
                      px-4 py-2 rounded-md transition-all duration-200 ease-in-out
                      focus:outline-none focus-visible:ring-2
                      ltr:mr-2 rtl:ml-2 font-bold`}
                  onClick={() => setTab(4)}
                >
                  Cohort
                </button>

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
