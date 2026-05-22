import { format } from "date-fns";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiExam } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../Api/authApi";
import { useMcqExamServiceTypeQuery } from "../../Api/p2twebApi";
import { useGetMcqQuery, useGetPackageQuery } from "../../Api/spAppApi";
import convertData from "../../Helper/ConvertData";
import toastNotify from "../../Helper/ToastNotify";
import examTimeFormatter from "../../Helper/examTimeFormatter";
import rtkErrorRead from "../../Helper/rtkErrorRead";
import {
  setSelectedInternalService,
  setSelectedMCQPaper,
  setSelectedMCQSet,
  setSelectedPackage,
} from "../../Store/Slice/DetailSlice";
import { RootState } from "../../Store/Store";
import useUserData from "../../hooks/userData";
import { InternalService } from "../../interface/InternalService";
import TblMasterMCQPaper from "../../interface/MCQPaper";
import TblMasterMCQSet from "../../interface/MCQSet";
import { IPackage } from "../../interface/Package";
import "../../styles/drawer.css";
import DrawerComp from "../Common/DrawerComp";
import ModalComp2 from "../Common/ModalComp2";

const MCQPage2 = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { selectedPackage, selectedInternalService } = useSelector(
    (s: RootState) => s.detailed,
  );

  const packageApi = useGetPackageQuery({});
  const serviceApi = useMcqExamServiceTypeQuery(
    {
      PackageId: selectedPackage?.PackageId,
    },
    { skip: isNaN(Number(selectedPackage?.PackageId)) },
  );
  const mcqApi = useGetMcqQuery(
    {
      PackageId: selectedPackage?.PackageId,
    },
    { skip: isNaN(Number(selectedPackage?.PackageId)) },
  );

  const [packageList, setPackageList] = useState<IPackage[]>([]);
  const [serviceOptions, setServiceOptions] = useState<InternalService[]>([]);
  const [mcqList, setMcqList] = useState<TblMasterMCQSet[]>([]);
  const [toggleDrawer, setToggleDrawer] = useState<boolean>(false);

  useEffect(() => {
    if (packageApi.isError) {
      rtkErrorRead(packageApi.error);
    } else {
      const PackageData = convertData(packageApi?.data?.result);
      // console.log(PackageData)
      if (PackageData && PackageData.length > 0) {
        setPackageList(PackageData);
        if (selectedPackage === null) {
          dispatch(setSelectedPackage(PackageData[0]));
        }
      }
    }
  }, [packageApi]);

  useEffect(() => {
    if (mcqApi.isError) {
      rtkErrorRead(mcqApi.error);
    } else {
      const data = convertData(mcqApi?.data?.result);
      if (data && data.length > 0) {
        setMcqList(data[0]?.TblMasterMCQSet ?? []);
        // console.log(data[0]?.TblMasterMCQSet ?? [])
      }
    }
  }, [mcqApi]);

  useEffect(() => {
    if (serviceApi.isError) {
      rtkErrorRead(serviceApi.error);
    } else {
      const data = convertData(serviceApi?.data?.result) || [];
      setServiceOptions(data);
      if (selectedInternalService == null) {
        dispatch(setSelectedInternalService(data[0]));
        setMcqList([]);
      }
    }
  }, [serviceApi]);

  const { state } = location;

  useEffect(() => {
    if (!isNaN(Number(state?.packageId)) && (selectedPackage === null)) {
      dispatch(setSelectedPackage({ PackageId: Number(state.packageId) }));
    }
    if (!isNaN(Number(state?.examId))) {
      const { examId } = state;
      const exam = mcqList.find((m) => Number(m.MCQSetId) === Number(examId));
      if (exam) {
        const examService = serviceOptions.find(
          (s) => Number(s.InternelServiceId) === Number(exam.InternelServiceId),
        );
        if (examService) {
          dispatch(setSelectedInternalService(examService));
        }
      }
    }
  }, [state, mcqList, serviceOptions]);

  return (
    <section className="bg-main-bg text-slate-800">
      <nav className="sticky top-0 z-50 bg-[#DCE9F9] px-4 py-3 shadow-md md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 flex">
            <img
              src="/assets/logi.png"
              alt="Peaks2Tails Logo"
              className="h-14 max-w-[230px] object-contain"
            />
          </div>

          <button
            type="button"
            onClick={() => setToggleDrawer(true)}
            className="h-11 w-11 shrink-0 rounded-xl text-secondary bg-white shadow shadow-indigo-300 flex items-center justify-center active:scale-95 transition"
            aria-label="Open menu"
          >
            <GiHamburgerMenu className="text-xl" />
          </button>

          {/* <div className="h-11 w-11 shrink-0" /> */}
        </div>
      </nav>
      <div className="flex h-[calc(100vh-80px)] md:h-screen overflow-hidden">
        <SideBar
          packageList={packageList}
          toggleDrawer={toggleDrawer}
          setToggleDrawer={setToggleDrawer}
        />
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          <Header />
          <ExamTypeSelection options={serviceOptions} />
          <MyExams
            mcqList={
              !!serviceOptions?.length
                ? mcqList.filter(
                  (m) =>
                    Number(m.InternelServiceId) ===
                    Number(selectedInternalService?.InternelServiceId),
                )
                : []
            }
          />
        </main>
      </div>
    </section>
  );
};

const SideBar = ({
  packageList,
  toggleDrawer,
  setToggleDrawer,
}: {
  packageList: IPackage[];
  toggleDrawer: boolean;
  setToggleDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutUserMutation();
  const { selectedPackage } = useSelector((s: RootState) => s.detailed);

  const handlePackageClick = (pkg: any) => {
    dispatch(setSelectedPackage(pkg));
  };

  async function handelLogout() {
    const res = await logoutApi(null);
    if (res.error) {
      rtkErrorRead(res.error);
    } else {
      toastNotify("Logout Successfully", "success");
      localStorage.removeItem("token");
      window.location.replace("/");
    }
  }

  return (
    <>
      <aside className="w-72 h-full bg-background-light border-r border-blue-100 md:flex flex-col shrink-0 hidden">
        <div className="p-8">
          <img src="/assets/logi.png" alt="" />
        </div>
        <div className="exam-type-scroll flex-1 px-6 overflow-y-auto sidebar-scroll">
          <nav className="space-y-6">
            <div>
              <h2 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 px-2">
                Dashboard
              </h2>
              <div className="space-y-2">
                {packageList.map((p: IPackage) => {
                  return (
                    <button
                      key={p.PackageId}
                      onClick={() => handlePackageClick(p)}
                      className={`${p.PackageId === selectedPackage?.PackageId ? "bg-primary text-yellow-50" : "bg-transparent text-primary"} border-2 border-primary w-full py-2.5 mx-2 px-4  font-bold rounded-full shadow-md text-sm tracking-wide`}
                    >
                      {p.PackageName}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
        <div className="p-8">
          <button
            onClick={handelLogout}
            className="w-full py-3 px-4 bg-secondary text-secondary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-secondary-hover"
          >
            Sign out
          </button>
        </div>
      </aside>

      <DrawerComp
        open={toggleDrawer}
        onClose={() => {
          setToggleDrawer(false);
        }}
        title=""
        size={"xs"}
        placement="left"
        action={"Dashboard"}
      >
        <aside className="h-full bg-background-light flex flex-col shrink-0">
          <div className="exam-type-scroll flex-1 px-6 overflow-y-auto sidebar-scroll">
            <nav className="space-y-6">
              <div>
                {/* <h2 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 px-2">
                Dashboard
              </h2> */}
                <div className="space-y-2">
                  {packageList.map((p: IPackage) => {
                    return (
                      <button
                        key={p.PackageId}
                        onClick={() => {
                          handlePackageClick(p);
                          setToggleDrawer(false);
                        }}
                        className={`${p.PackageId === selectedPackage?.PackageId ? "bg-primary text-yellow-50" : "bg-transparent text-primary"} border-2 border-primary w-full py-2.5 mx-2 px-4  font-bold rounded-full shadow-md text-sm tracking-wide`}
                      >
                        {p.PackageName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
          <div className="p-8">
            <button
              onClick={handelLogout}
              className="w-full py-3 px-4 bg-secondary text-secondary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-secondary-hover"
            >
              Sign out
            </button>
          </div>
        </aside>
      </DrawerComp>
    </>
  );
};

const Header = () => {
  const user = useUserData();

  return (
    <section className="bg-[#DCE9F9] rounded-3xl p-8 relative overflow-hidden flex shadow">
      <div className="relative z-10">
        <h1 className="md:text-3xl text-xl font-bold text-[#003B6B]">
          Welcome To better Learning,
          <span className="text-primary ml-2 font-bold">{user.FullName}</span>
        </h1>

        <div className="mt-6 flex items-center gap-5">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="text-primary md:text-sm text-xs font-bold">
              Ready to start your test? Give it your best! ✨
            </span>
          </div>
        </div>
      </div>

      <div className="absolute right-10 my-auto">
        <span className="text-9xl font-black text-secondary-light/10 uppercase">
          p2t
        </span>
      </div>
    </section>
  );
};

const ExamTypeSelection = ({ options }: { options: InternalService[] }) => {
  const dispatch = useDispatch();
  const { selectedInternalService } = useSelector((s: RootState) => s.detailed);

  return (
    <section className="exam-type-scroll flex gap-4 overflow-x-auto pb-4">
      {options.map((o, index) => {
        return (
          <div
            key={`et-${o.InternelServiceId}-${index}`}
            className={`
          ${selectedInternalService?.InternelServiceId === o.InternelServiceId
                ? "bg-[#FDE7C1] border-orange-200/50"
                : "bg-[#E1EDF9] border-blue-200/50"
              }
          min-w-[260px] 
          p-5 sm:p-6 
          rounded-2xl 
          flex 
          flex-col 
          border 
          shadow
        `}
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <PiExam />
            </div>

            <h3 className="font-bold text-lg mb-2 text-slate-800">
              {o.ServicesTypeName}
            </h3>

            <p className="text-sm text-slate-600 flex-1 leading-relaxed">
              {o.Explanation}
            </p>

            <button
              onClick={() => dispatch(setSelectedInternalService(o))}
              className="mt-4 flex items-center gap-2 text-slate-800 font-bold text-sm px-4 py-2 bg-white rounded-full w-fit shadow shadow-slate-500"
            >
              Get started
            </button>
          </div>
        );
      })}
    </section>
  );
};

const MyExams = ({ mcqList }: { mcqList: TblMasterMCQSet[] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedInternalService, selectedMcqSet } = useSelector(
    (s: RootState) => s.detailed,
  );
  const [paperModal, setPaperModal] = useState<boolean>(false);

  function getExamMeta(e: TblMasterMCQSet) {
    let duration = 0;
    let marks = 0;
    let noOfQus = 0;
    let paperCount = 0;

    e.TblMasterMCQPaper?.forEach((p) => {
      duration += p.PaperDuration ?? 0;
      marks += p.TotalMarks ?? 0;
      paperCount += 1;
      p?.TblMasterMCQSection?.forEach((s) => {
        noOfQus += s.MinQuestionAttempt ?? 0;
      });
    });

    return { duration, marks, noOfQus, paperCount };
  }

  const handleSelectPaper = (p: TblMasterMCQPaper) => {
    dispatch(
      setSelectedMCQPaper({
        PaperType: selectedInternalService?.ServicesTypeName,
        ...p,
      }),
    );

    navigate("/paper");
  };

  return (
    <>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#003B6B]">My Exams</h2>
        </div>
        {mcqList.length === 0 && (
          <p className="text-secondary-active mt-4">No exam found</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
          {mcqList.map((m) => {
            const meta = getExamMeta(m);

            return (
              <div
                key={`exam-${m.MCQSetId}`}
                className="w-full bg-white border border-slate-200 border-b-secondary-active rounded-xl border-b-4 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-secondary rounded-t-xl px-6 py-5">
                  <h2 className="text-white font-semibold text-lg tracking-tight">
                    {m.MCQSetName}
                  </h2>

                  <div className="mt-3 space-y-1 text-sm text-slate-300">
                    {!!m.MCQFromDate && (
                      <p>
                        <span className="font-medium text-slate-400">
                          From:
                        </span>{" "}
                        {format(new Date(m.MCQFromDate), "dd-MM-yyyy")}
                      </p>
                    )}
                    {!!m.MCQUptoDate && (
                      <p>
                        <span className="font-medium text-slate-400">To:</span>{" "}
                        {format(new Date(m.MCQUptoDate), "dd-MM-yyyy")}
                      </p>
                    )}
                  </div>
                </div>
                {/* Body */}
                <div className="px-6 py-5 space-y-4 text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Total Questions</span>
                    <span className="font-semibold text-slate-800">
                      {meta.noOfQus}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Total Marks</span>
                    <span className="font-semibold text-slate-800">
                      {meta.marks}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-semibold text-slate-800">
                      {examTimeFormatter(meta.duration)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Papers</span>
                    <span className="font-semibold text-slate-800">
                      {meta.paperCount}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                  <button
                    className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg font-medium py-3 transition-colors duration-200"
                    onClick={() => {
                      dispatch(setSelectedMCQSet(m));
                      setPaperModal(true);
                    }}
                  >
                    Show Papers
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <ModalComp2
        open={!!paperModal}
        onClose={() => {
          setPaperModal(false);
          dispatch(setSelectedMCQSet({}));
        }}
        title="View Papers"
      >
        <div className="space-y-3">
          {selectedMcqSet?.TblMasterMCQPaper?.length === 0 && (
            <p className="text-secondary-active mt-4">No paper found</p>
          )}

          {selectedMcqSet?.TblMasterMCQPaper?.map((p) => (
            <div
              key={`paper-${p.MCQPaperId}`}
              className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm"
            >
              {/* Left Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 truncate">
                  {p.MCQPaperName}
                </h3>

                <div className="flex flex-wrap gap-4 mt-1 text-xs text-slate-500">
                  {!!p.MCQPaperStartDate && (
                    <span>
                      <b className="text-secondary">Start:</b>{" "}
                      {format(
                        new Date(p.MCQPaperStartDate),
                        "dd-MM-yyyy HH:mm a",
                      )}
                    </span>
                  )}
                  {!!p.PaperDuration && (
                    <span>
                      <b className="text-secondary">Duration:</b>{" "}
                      {examTimeFormatter(p.PaperDuration)}
                    </span>
                  )}
                  <span>
                    <b className="text-secondary">Marks:</b> {p.TotalMarks}
                  </span>
                </div>
              </div>

              {/* Right Button */}
              <div className="ml-4">
                <button
                  className="bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium px-4 py-2 rounded-md transition-colors duration-200"
                  onClick={() => handleSelectPaper(p)}
                >
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      </ModalComp2>
    </>
  );
};

export default MCQPage2;
