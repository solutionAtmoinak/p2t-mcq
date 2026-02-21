import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { TiTickOutline } from "react-icons/ti"
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDownloadCertificateMutation } from '../../Api/p2twebApi'
import { useSubmitAnswerMutation, useSubmitExamMutation } from '../../Api/spAppApi'
import rtkErrorRead from '../../Helper/rtkErrorRead'
import toastNotify from '../../Helper/ToastNotify'
import { TblMasterMcqAnswer } from '../../interface/MCQQuestion'
import { RootState } from '../../Store/Store'

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { IoMdClose, IoMdDoneAll } from "react-icons/io"
import { resetSelectedOptions } from '../../Store/Slice/McqSlice'

const ResultPage2 = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();
    const { resultData } = location.state;

    const submittedTime = useRef<string>(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));

    const { selectedOptions, mcqQuestionList: question, selectedPackageId: packageId } = useSelector((state: RootState) => state.mcqQuestion)
    const { selectedMcqPaper } = useSelector((state: RootState) => state.detailed);

    const [submitAnsApi] = useSubmitAnswerMutation()
    const [submitExamApi] = useSubmitExamMutation()

    const [downloadCertificateApi] = useDownloadCertificateMutation()


    useEffect(() => {
        if (!!!selectedMcqPaper?.MCQPaperId) {
            navigate('/mcq')
        }
    }, [selectedMcqPaper])

    const [totalCorrectMarks, setTotalCorrectMarks] = useState(0);
    const {
        TotalMarks,
        // TotalPassMarks,
        // TimeLeft,
        // MCQPaperName,
        // IsNegativeMark,
        SpendedTime
    } = resultData;




    async function submitAnsToDb(marks: number) {

        const options = selectedOptions.map((opt: TblMasterMcqAnswer) => {

            return {
                MCQQuestionId: opt.MCQQuestionId,
                MCQOptionId: opt.MCQOptionId,
                MCQPaperId: selectedMcqPaper.MCQPaperId,
                IsCorrect: !!opt.IsCorrect,
                Marks: opt.MCQPartialCorrectMarks,
                OneWordAnswer: opt.OneWordAnswer
            }
        });

        if (Array.isArray(options)) {
            submitAnsApi({
                SpendedTime: SpendedTime,
                QuestionAnswerListofStudent: options
            }).then((res: any) => {
                console.log(res?.data?.result);
            }).catch((err) => {
                console.log(err);
            })

            const res = await submitExamApi({
                MCQExamHistory: {
                    ExamId: selectedMcqPaper.MCQPaperId,
                    ExamType: selectedMcqPaper.PaperType,
                    ExamName: selectedMcqPaper.MCQPaperName,
                    ObtainMarks: marks,
                    AttemptDate: location.state.examStartTime,
                    SubmitDate: submittedTime.current,
                }
            })
            if (res.error) {
                rtkErrorRead(res.error)
            } else {
                toastNotify(res.data?.result, "success")
            }
        }
    }

    useEffect(() => {
        let correctMarks = 0
        selectedOptions.forEach((opt) => {
            if (opt.IsCorrect) {
                correctMarks += opt.MCQPartialCorrectMarks ?? 0
            } else {
                correctMarks -= opt.MCQPartialNegativeMarks ?? 0
            }
        })

        setTotalCorrectMarks(correctMarks);
        // console.log({ selectedOptions });

        if (location.state.SaveToDb) {
            submitAnsToDb(correctMarks)
        }

    }, [selectedOptions, location]);

    const downloadPdf = async () => {
        const doc = new jsPDF();
        const margin = 10;
        const padding = 5;
        const usableWidth = doc.internal.pageSize.width - 2 * (margin + padding);
        const usableHeight = doc.internal.pageSize.height - 2 * margin;

        let y = margin + padding;
        let currentPage = 1;

        const drawBorder = () => {
            doc.rect(
                margin,
                margin,
                doc.internal.pageSize.width - 2 * margin,
                doc.internal.pageSize.height - 2 * margin
            );
        };

        drawBorder();
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("MCQ Question / Answers", doc.internal.pageSize.width / 2, y, {
            align: "center",
        });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        y += 15;

        const addPageIfNeeded = (lineCount: number) => {
            if (y + lineCount * 8 > margin + usableHeight) {
                doc.addPage();
                currentPage++;
                drawBorder();
                y = margin + padding;
            }
        };
        // y += 15;

        question.forEach((q, index) => {

            doc.setFontSize(10);
            // Passage
            if (q.PassageDetails?.trim()) {
                const plainPassage = stripHtmlTags(q.PassageDetails);
                const passageLines = doc.splitTextToSize(
                    `Passage: ${plainPassage}`,
                    usableWidth
                );
                addPageIfNeeded(passageLines.length);
                passageLines.forEach((line: any) => {
                    doc.text(line, margin + padding, y);
                    y += 8;
                });
                y += 4;
            }
            doc.setFontSize(12);
            doc.setTextColor(7, 37, 84);
            const questionLines = doc.splitTextToSize(q.MCQQuestion!, 165);
            addPageIfNeeded(questionLines.length);

            if (questionLines.length > 0) {
                doc.text(`${index + 1}. ${questionLines[0]}`, margin + padding, y);
                y += 8;

                for (let i = 1; i < questionLines.length; i++) {
                    doc.text(questionLines[i], margin + padding + 10, y);
                    y += 8;
                }
            }

            y += 4;
            doc.setTextColor(0, 0, 0);
            // Correct answers
            let correctAnswers = ''

            q.MCQOptions?.forEach((o, i) => {
                if (o.IsCorrect) {
                    if (correctAnswers === '') {
                        correctAnswers += `${String.fromCharCode(65 + i)}) ${o.MCQOption}`
                    } else {
                        correctAnswers += `, ${String.fromCharCode(65 + i)}) ${o.MCQOption}`
                    }
                }
            })
            const answerLines = doc.splitTextToSize(
                `Correct Answer(s): ${correctAnswers}`,
                165
            );
            addPageIfNeeded(answerLines.length);
            doc.setFont("helvetica", "bold");
            answerLines.forEach((line: any) => {
                doc.text(line, margin + padding, y);
                y += 8;
            });

            doc.setFont("helvetica", "normal");
            y += 4;

            // explanation
            if (q.AnswerExplanation?.trim()) {
                const plainPassage = stripHtmlTags(q.AnswerExplanation);

                // Bold label
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                const label = "Explanation:";
                const labelLines = doc.splitTextToSize(label, usableWidth);
                addPageIfNeeded(labelLines.length);
                labelLines.forEach((line: any) => {
                    doc.text(line, margin + padding, y);
                    y += 8;
                });

                // Normal text on next line
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                const explanationLines = doc.splitTextToSize(plainPassage, usableWidth);
                addPageIfNeeded(explanationLines.length);
                explanationLines.forEach((line: any) => {
                    doc.text(line, margin + padding, y);
                    y += 7;
                });
            }

            y += 10
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
        })

        for (let i = 1; i <= currentPage; i++) {
            doc.setPage(i);
            doc.text(
                `Page ${i} of ${currentPage}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - margin / 2,
                { align: "center" }
            );
        }

        doc.save("mcq-qa.pdf");
    };


    const stripHtmlTags = (html: string): string =>
        html
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();


    async function downloadCertificate() {
        const res = await downloadCertificateApi({
            PaperId: selectedMcqPaper?.MCQPaperId,
            PackageId: packageId,
            CertificateType: 'Mcq'
        })
        if (res.error) {
            rtkErrorRead(res.error)
        } else {
            const html = JSON.parse(res.data?.result); // HTML STRING

            // Create hidden container
            const container = document.createElement("div");
            container.innerHTML = html;

            container.style.position = "fixed";
            container.style.top = "0";
            container.style.left = "0";
            container.style.pointerEvents = "none";
            container.style.zIndex = "-100";

            document.body.appendChild(container);

            await html2canvas(container, {
                scale: 2,
                useCORS: true,
            }).then(canvas => {
                const imgData = canvas.toDataURL("image/png");

                const pdf = new jsPDF("l", "mm", "a4");
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();

                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
                pdf.save("certificate.pdf");
            });

            document.body.removeChild(container);
        }

    }



    const percentage = Math.round((totalCorrectMarks / TotalMarks) * 100);

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "radialBar" as const,
            height: 800,
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                hollow: {
                    size: "45%",
                },
                track: {
                    background: "#e5e7eb",
                    strokeWidth: "100%",
                },
                dataLabels: {
                    name: {
                        show: true,
                        offsetY: 40,
                        fontSize: "14px",
                    },
                    value: {
                        offsetY: -10,
                        fontSize: "34px",
                        fontWeight: 600,
                        formatter: () => totalCorrectMarks.toString(),
                    },
                },
            },
        },
        colors: ["#f59e0b"],
        labels: ["Score"],
    };

    return (
        <main className='p-6'>
            <header className="bg-[#DCE9F9] rounded-3xl p-8 relative overflow-hidden shadow ">
                <h1 className="font-display text-3xl font-bold text-primary  mb-6">
                    {selectedMcqPaper.MCQPaperName}
                </h1>

            </header>
            <section className='mt-4 flex gap-6'>
                {/* gauss gauge */}
                <div className='p-4 bg-sky-50 w-fit rounded-lg '>
                    <ReactApexChart
                        options={options}
                        series={[percentage]}
                        type="radialBar"
                        height={800}

                    />
                </div>
                <div>
                    <div className='flex gap-6'>
                        <div className="bg-orange-100 rounded-xl px-6 py-5 flex items-center justify-between w-60 shadow-sm">

                            <div>
                                <h4 className="text-gray-500 text-sm font-bold">
                                    Answered
                                </h4>
                                <p className="text-3xl font-semibold text-gray-800">
                                    {selectedOptions.length}
                                </p>
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white">
                                <TiTickOutline size={20} />
                            </div>
                        </div>
                        <div className="bg-green-100 rounded-xl px-6 py-5 flex items-center justify-between w-60 shadow-sm">
                            <div>
                                <h4 className="text-gray-500 text-sm font-bold">
                                    Correct
                                </h4>
                                <p className="text-3xl font-semibold text-gray-800">
                                    {selectedOptions.filter((o) => !!o.IsCorrect).length}
                                </p>
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white">
                                <IoMdDoneAll size={20} />
                            </div>
                        </div>
                        <div className="bg-red-100 rounded-xl px-6 py-5 flex items-center justify-between w-60 shadow-sm">
                            <div>
                                <h4 className="text-gray-500 text-sm font-bold">
                                    Un-Answered
                                </h4>
                                <p className="text-3xl font-semibold text-gray-800">
                                    {question.length - selectedOptions.length}
                                </p>
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white">
                                <IoMdClose size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="flex mt-8 gap-x-4">
                    <button
                        onClick={downloadCertificate}
                        className="m-2 px-4 py-2 rounded-lg text-green-100 bg-amber-500 "
                    >
                        Download Certificate
                    </button>
                    <button
                        onClick={downloadPdf}
                        className="m-2 px-4 py-2 rounded-lg text-green-100 bg-green-500 "
                    >
                        Download Answers
                    </button>
                    <button className="m-2 px-4 py-2 bg-indigo-500 rounded-lg text-indigo-100" onClick={() => {
                        dispatch(resetSelectedOptions())
                        navigate('/mcq', { replace: true })
                    }}>
                        Save & Exit
                    </button>
                </div>
            </section>
        </main>
    )
}

export default ResultPage2