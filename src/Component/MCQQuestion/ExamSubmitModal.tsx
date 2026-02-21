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
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={() => { }}
                >
                    <div className="flex items-center justify-center min-h-screen p-4 text-center">
                        <Dialog.Panel className="border-2 border-slate-4  00 bg-slate-100 max-w-sm p-6 mx-auto  rounded-lg shadow-xl transform transition-all duration-300 scale-95 hover:scale-100 animate-blink">
                            <Dialog.Title
                                as="h3"
                                className="text-2xl font-semibold text-black mb-4"
                            >
                                <div className="flex justify-center mb-4 gap-4 ">
                                    <IconSad />
                                    <span className="font-bold">Time is Over</span>
                                </div>
                            </Dialog.Title>
                            <div className="mt-4">
                                <p className="text-lg text-black font-semibold">
                                    Your time is over. Would you like to submit your test.
                                </p>
                            </div>
                            <div className="flex gap-6 mt-6 justify-center">
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-green-500 hover:bg-green-600 rounded-md text-green-100 ease-in-out duration-400 transition"
                                    onClick={props.onSubmit}
                                >
                                    Submit
                                </button>

                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>
        )
    } else {
        return (
            <Transition appear show={props.open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={() => { }}
                >
                    <div className="flex items-center justify-center min-h-screen p-4 text-center">
                        <Dialog.Panel className="border-2 border-slate-400 bg-slate-100  max-w-xl p-6 mx-auto  rounded-lg shadow-xl ">
                            <Dialog.Title
                                as="h3"
                                className="text-2xl font-bold text-red-700 mb-4"
                            >
                                Ready to Submit?
                            </Dialog.Title>
                            <div className="text-lg text-black font-semibold">
                                <p className="mb-4">
                                    Before you finish, double-check your answers! Are you sure
                                    you want to submit your answer sheet?
                                </p>
                                <p className="italic text-sm text-red-700">
                                    Once submitted, you cannot make any further changes.
                                </p>
                            </div>
                            <div className="flex  justify-center gap-6 mt-6">
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-green-500 hover:bg-green-600 rounded-md text-green-100 ease-in-out duration-400 transition"
                                    onClick={props.onSubmit}
                                >
                                    Yes!! Submit
                                </button>
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-md text-green-100 ease-in-out duration-400 transition"
                                    onClick={props.onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>)
    }
}

export default ExamSubmitModal