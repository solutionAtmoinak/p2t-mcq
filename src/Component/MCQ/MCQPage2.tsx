import { useDispatch, useSelector } from "react-redux";
import { useGetPackageQuery } from "../../Api/spAppApi";
import { useLogoutUserMutation } from "../../Api/authApi";
import { useState } from "react";
import convertData from "../../Helper/ConvertData";
import rtkErrorRead from "../../Helper/rtkErrorRead";
import { useEffect } from "react";
import toastNotify from "../../Helper/ToastNotify";
import { setSelectedPackage } from "../../Store/Slice/DetailSlice";
import { RootState } from "../../Store/Store";
import { IPackage } from "../../interface/Package";

const MCQPage2 = () => {
    return (
        <section className="bg-main-bg text-slate-800">
            <div className="flex h-screen overflow-hidden">
                <SideBar />
                <main className="flex-1 overflow-y-auto p-8 space-y-8">
                    <section className="bg-[#DCE9F9] rounded-3xl p-8 relative overflow-hidden">
                        <div className="relative z-10 max-w-2xl">
                            <h1 className="text-3xl font-bold text-[#003B6B]">Welcome To better Learning, <span
                                className="text-primary">Rahul Sharma</span></h1>
                            <p className="text-[#003B6B]/70 mt-2 font-medium italic">Best, no-risk heading</p>
                            <div className="mt-6 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                                <span className="text-primary text-sm font-bold">Ready to start your test? Give it your best!
                                    ✨</span>
                            </div>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
                            <span className="material-symbols-outlined text-[150px] rotate-12">school</span>
                        </div>
                    </section>
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-[#FDE7C1] p-6 rounded-2xl flex flex-col border border-orange-200/50">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                <span className="material-symbols-outlined text-primary">lightbulb</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-slate-800">Quick Practice</h3>
                            <p className="text-sm text-slate-600 flex-1 leading-relaxed">Practice small sets of questions to quickly
                                understand concepts and improve accuracy.</p>
                            <a className="mt-4 flex items-center gap-2 text-slate-800 font-bold text-sm" href="#">
                                Get started <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </a>
                        </div>
                        <div className="bg-[#E1EDF9] p-6 rounded-2xl flex flex-col border border-blue-200/50">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                <span className="material-symbols-outlined text-blue-500">groups</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-slate-800">Cohort</h3>
                            <p className="text-sm text-slate-600 flex-1 leading-relaxed">Structured batch-based learning with live
                                sessions, assessments, and progress tracking.</p>
                            <a className="mt-4 flex items-center gap-2 text-slate-800 font-bold text-sm" href="#">
                                Get started <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </a>
                        </div>
                        <div className="bg-[#E1EDF9] p-6 rounded-2xl flex flex-col border border-blue-200/50">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                <span className="material-symbols-outlined text-blue-500">assignment</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-slate-800">Comprehensive Full Test</h3>
                            <p className="text-sm text-slate-600 flex-1 leading-relaxed">Full-syllabus assessment to measure
                                conceptual clarity, accuracy, and time management.</p>
                        </div>
                        <div className="bg-[#E1EDF9] p-6 rounded-2xl flex flex-col border border-blue-200/50">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                <span className="material-symbols-outlined text-blue-500">workspace_premium</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-slate-800">Certification(MCQ)</h3>
                            <p className="text-sm text-slate-600 flex-1 leading-relaxed">Standardized MCQ assessments for skill
                                validation and certification.</p>
                        </div>
                    </section>
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[#003B6B]">My Exam</h2>
                        </div>
                        <div className="bg-white rounded-3xl p-1 border border-slate-100 custom-card-shadow">
                            <div className="flex flex-col lg:flex-row gap-6 p-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-[#003B6B] mb-4">ICRM (Integrated Credit Risk Model)</h3>
                                    <div
                                        className="relative bg-secondary rounded-2xl p-6 overflow-hidden aspect-[16/9] lg:aspect-auto h-[220px] flex items-center justify-between group">
                                        <div className="relative z-10 space-y-4">
                                            <div className="text-white">
                                                <p className="text-xs uppercase tracking-widest font-bold opacity-60">Course</p>
                                                <h4 className="text-lg font-bold leading-tight">INTEGRATED<br />CREDIT
                                                    RISK<br />MODELLING</h4>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[10px] text-white/50 uppercase">Valid Till:</p>
                                                <p className="text-xs text-white font-bold">Dec-27-2025</p>
                                            </div>
                                            <button className="bg-primary text-white text-xs font-bold py-2 px-6 rounded-full">Join
                                                Exam</button>
                                        </div>
                                        <div
                                            className="relative z-10 w-32 h-44 bg-white rounded shadow-2xl transform rotate-3 flex flex-col items-center justify-center p-2 border-l-4 border-slate-200">
                                            <div className="text-[8px] font-bold text-slate-400 uppercase mb-2">ICRM Handbook</div>
                                            <span className="material-symbols-outlined text-slate-200 text-6xl">menu_book</span>
                                            <div className="mt-4 w-full h-1 bg-slate-100 rounded"></div>
                                            <div className="mt-1 w-2/3 h-1 bg-slate-100 rounded"></div>
                                        </div>
                                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                                        // style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 20px 20px;"
                                        >
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-between text-xs text-slate-400 font-medium px-2">
                                        <span>Start Time: 10:00 AM</span>
                                        <span>End Time: 12:00 PM</span>
                                    </div>
                                </div>
                                <div className="lg:w-96 bg-[#F8FAFC] rounded-2xl p-8 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h4 className="text-lg font-bold text-[#003B6B]">Hey!</h4>
                                            <p className="text-sm font-medium text-[#003B6B]/70">Confidence comes from preparation.
                                            </p>
                                        </div>
                                        <button
                                            className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-orange-200 hover:scale-105 transition-transform active:scale-95 text-sm">
                                            Start now
                                        </button>
                                    </div>
                                    <div className="space-y-4 mt-auto">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                            <span className="text-sm font-semibold text-slate-500">Total Questions:</span>
                                            <span className="text-sm font-bold text-[#003B6B]">100</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                            <span className="text-sm font-semibold text-slate-500">Total Marks:</span>
                                            <span className="text-sm font-bold text-[#003B6B]">100</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                            <span className="text-sm font-semibold text-slate-500">Duration:</span>
                                            <span className="text-sm font-bold text-[#003B6B]">120 Minutes</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-semibold text-slate-500">Question Type:</span>
                                            <span className="text-sm font-bold text-[#003B6B]">Multiple Choice (MCQ)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

        </section>

    )
}

const SideBar = () => {
    const dispatch = useDispatch()
    const packageApi = useGetPackageQuery({});
    const [logoutApi] = useLogoutUserMutation()
    const [packageList, setPackageList] = useState<any[]>([]);
    const { selectedPackage } = useSelector((s: RootState) => s.detailed)


    useEffect(() => {
        if (packageApi.isError) {
            rtkErrorRead(packageApi.error);
        } else {
            const PackageData = convertData(packageApi?.data?.result);
            // console.log(PackageData)
            if (PackageData && PackageData.length > 0) {
                setPackageList(PackageData);
                if (selectedPackage === null) {
                    dispatch(setSelectedPackage(PackageData[0]))
                }
            }
        }
    }, [packageApi]);

    const handlePackageClick = (pkg: any) => {
        dispatch(setSelectedPackage(pkg))
    };

    async function handelLogout() {
        const res = await logoutApi(null)
        if (res.error) {
            rtkErrorRead(res.error)
        } else {
            toastNotify("Logout Successfully", "success")
            localStorage.removeItem("token");
            window.location.replace("/");
        }
    }


    return (
        <aside className="w-72 h-full bg-background-light border-r border-blue-100 flex flex-col shrink-0">
            <div className="p-8">
                <img src="/assets/logi.png" alt="" />
            </div>
            <div className="flex-1 px-6 overflow-y-auto sidebar-scroll">
                <nav className="space-y-6">
                    <div>
                        <h2 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 px-2">Dashboard</h2>
                        <div className="space-y-2">
                            {packageList.map((p: IPackage) => {
                                return (
                                    <button
                                        key={p.PackageId}
                                        onClick={() => handlePackageClick(p)}
                                        className="w-full py-2.5 mx-2 px-4 bg-primary text-yellow-50 font-bold rounded-full shadow-md hover:bg-primary-hover text-sm tracking-wide active:bg-primary-active">
                                        {p.PackageName}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </nav>
            </div>
            <div className="p-8">
                <button onClick={handelLogout}
                    className="w-full py-3 px-4 bg-secondary text-secondary-foreground font-bold rounded-xl flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-hover">
                    Sign out
                </button>
            </div>
        </aside>
    )
}

export default MCQPage2