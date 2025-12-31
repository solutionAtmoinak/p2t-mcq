import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import ModalProps from "../interface/ModalProps";


const ModalComp: React.FC<ModalProps> = (props) => {
  return (
    <Transition appear show={props.open} as={Fragment}>
      <Dialog
        as='div'
        open={props.open}
        onClose={() => {
          return false;
        }}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className="fixed inset-0 bg-black opacity-30" />
        </Transition.Child>
        <div className='fixed inset-0 bg-[black]/60 z-[999] w-screen overflow-y-auto'>
          <div className='flex items-center justify-center min-h-full px-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              <Dialog.Panel
                className={`panel border-0 p-0 rounded-lg overflow-hidden w-full ${props.sizeClass} my-8 text-black dark:text-white-dark`}>
                <div className='flex bg-[#fbfbfb] dark:bg-[#d3d3d4] items-center justify-between px-5 py-3'>
                  <div className='font-bold text-lg'>{props.title}</div>
                  <button
                    type='button'
                    onClick={props.onClose}
                    className='text-white-dark hover:text-dark'>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <div className='p-5 bg-white'>
                  {props.children}

                  <div className='flex justify-end items-center gap-4'>
                    {props.closeBtnView && (
                      <button
                        type='button'
                        onClick={props.onClose}
                        className='border-2 rounded-md p-2 border-red-600 hover:bg-red-500'>
                        Discard
                      </button>
                    )}
                    {!!props.onSave &&
                      <div className="flex justify-end ">
                        <button
                          type="button"
                          onClick={props.onSave}
                          disabled={props.disabled}
                          className={`${props.disabled
                            ? "border-2 border-gray-700 text-black cursor-not-allowed"
                            : "border-2 border-green-600 text-green-600 hover:bg-green-700 hover:text-white"
                            } rounded-md p-2 transition duration-300`}
                        >
                          Accept and Start
                        </button>
                      </div>
                    }
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalComp;
