import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import IconSad from '../Icon/IconSad';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    isTimeEnd: boolean
}

const ExamSubmitModal = (props: Props) => {
    if (props.isTimeEnd) {
        return (
            <Transition appear show={props.open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-50 overflow-y-auto"
                    onClose={() => { }}
                >
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-[#02152d]/75 backdrop-blur-sm" />

                    <div className="flex min-h-screen items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-2"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className="
                                relative w-full max-w-md overflow-hidden
                                rounded-[28px]
                                border border-[#d6dfeb]
                                bg-[#edf3fa]
                                shadow-[0_25px_60px_rgba(2,21,45,0.35)]
                            "
                            >
                                {/* top accent */}
                                <div className="h-2 w-full bg-gradient-to-r from-[#0b2d5c] via-[#1a4d8f] to-[#f2a100]" />

                                {/* subtle bg effect */}
                                <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_top_left,_#0b2d5c_0,_transparent_35%),radial-gradient(circle_at_bottom_right,_#0b2d5c_0,_transparent_35%)]" />

                                <div className="relative p-8">
                                    {/* Icon */}
                                    <div className="flex justify-center">
                                        <div
                                            className="
                                            flex h-20 w-20 items-center justify-center
                                            rounded-full border-4 border-[#dce8f5]
                                            bg-white shadow-md
                                        "
                                        >
                                            <IconSad className="text-[#0b2d5c] scale-125" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <Dialog.Title
                                        as="h3"
                                        className="
                                        mt-5 text-center
                                        text-3xl font-extrabold
                                        tracking-wide text-[#0b2d5c]
                                    "
                                    >
                                        Time is Over
                                    </Dialog.Title>

                                    {/* Message */}
                                    <div className="mt-5 text-center">
                                        <p className="text-[16px] leading-7 text-slate-600">
                                            Your examination time has ended. Please submit
                                            your test to complete the assessment process.
                                        </p>
                                    </div>

                                    {/* Warning */}
                                    <div
                                        className="
                                        mt-6 rounded-2xl border
                                        border-[#f2a100]/30
                                        bg-[#fff8ea]
                                        px-5 py-4 text-center
                                    "
                                    >
                                        <p className="text-sm font-semibold text-[#b77900]">
                                            Your answers will be automatically locked after
                                            submission.
                                        </p>
                                    </div>

                                    {/* Button */}
                                    <div className="mt-8 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={props.onSubmit}
                                            className="
                                            rounded-xl bg-[#f2a100]
                                            px-10 py-3
                                            text-sm font-bold text-white
                                            shadow-md transition-all duration-300
                                            hover:-translate-y-0.5
                                            hover:bg-[#d89200]
                                            active:scale-95
                                        "
                                        >
                                            Submit Test
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        )
    } else {
        return (
            <Transition appear show={props.open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-50 overflow-y-auto"
                    onClose={() => { }}
                >
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-[#02152d]/70 backdrop-blur-sm" />

                    <div className="flex min-h-screen items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-3"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className="
                        relative w-full max-w-xl overflow-hidden
                        rounded-[28px]
                        border border-[#cfd9e5]
                        bg-[#edf3fa]
                        shadow-[0_20px_60px_rgba(1,20,40,0.35)]
                    "
                            >
                                {/* top accent */}
                                <div className="h-2 w-full bg-gradient-to-r from-[#0b2d5c] via-[#1a4d8f] to-[#f2a100]" />

                                {/* subtle pattern */}
                                <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_top_left,_#0b2d5c_0,_transparent_35%),radial-gradient(circle_at_bottom_right,_#0b2d5c_0,_transparent_35%)]" />

                                <div className="relative p-8 sm:p-10">
                                    {/* Icon */}
                                    <div
                                        className="
                                mx-auto mb-6 flex h-20 w-20 items-center justify-center
                                rounded-full border-4 border-[#d8e6f7]
                                bg-white shadow-md
                            "
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.8}
                                            stroke="currentColor"
                                            className="h-10 w-10 text-[#0b2d5c]"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 9v3.75m0 3.75h.008v.008H12v-.008Zm8.25-3.758c0 4.97-3.805 9-8.5 9s-8.5-4.03-8.5-9 3.805-9 8.5-9 8.5 4.03 8.5 9Z"
                                            />
                                        </svg>
                                    </div>

                                    {/* Heading */}
                                    <Dialog.Title
                                        as="h3"
                                        className="
                                text-center text-3xl font-extrabold
                                tracking-wide text-[#0b2d5c]
                            "
                                    >
                                        Ready to Submit?
                                    </Dialog.Title>

                                    {/* Subtitle */}
                                    <p
                                        className="
                                mx-auto mt-5 max-w-lg text-center
                                text-[16px] leading-7 text-slate-600
                            "
                                    >
                                        Before final submission, please verify all your
                                        answers carefully. Once submitted, your response
                                        sheet will be locked permanently.
                                    </p>

                                    {/* Warning Box */}
                                    <div
                                        className="
                                mt-6 rounded-2xl border
                                border-[#f2a100]/30
                                bg-[#fff8ea]
                                px-5 py-4
                                text-center
                            "
                                    >
                                        <p className="text-sm font-semibold text-[#b77900]">
                                            You will not be able to make further changes
                                            after submission.
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                                        <button
                                            type="button"
                                            onClick={props.onSubmit}
                                            className="
                                    rounded-xl bg-[#f2a100]
                                    px-8 py-3
                                    text-sm font-bold text-white
                                    shadow-md transition-all duration-300
                                    hover:-translate-y-0.5
                                    hover:bg-[#d89200]
                                    active:scale-95
                                "
                                        >
                                            Submit Answers
                                        </button>

                                        <button
                                            type="button"
                                            onClick={props.onClose}
                                            className="
                                    rounded-xl border border-[#c5d2e0]
                                    bg-white px-8 py-3
                                    text-sm font-bold text-[#0b2d5c]
                                    shadow-sm transition-all duration-300
                                    hover:bg-[#f4f8fc]
                                    active:scale-95
                                "
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        )
    }
}

export default ExamSubmitModal