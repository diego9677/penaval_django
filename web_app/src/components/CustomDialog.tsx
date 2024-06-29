import { Transition, Dialog } from "@headlessui/react";
// import clsx from "clsx";
import { Fragment, ReactNode } from 'react';

type Size = 'sm' | 'md' | 'lg' | 'default' | 'xl';

interface Props {
  dialog: boolean;
  closeDialog: () => void;
  size?: Size;
  children?: ReactNode;
}

// const SIZES = {
//   'lg': 'w-3/4',
//   'md': 'w-1/2',
//   'sm': 'w-1/3',
//   'xl': 'w-11/12',
//   'default': 'w-auto'
// };


export function CustomDialog({ dialog, closeDialog, children }: Props) {
  return (
    <Transition appear show={dialog} as={Fragment}>
      <Dialog className='fixed z-30 inset-0 overflow-hidden h-full' open={dialog} onClose={closeDialog}>

        <Dialog.Overlay className="z-40 fixed inset-0 bg-black opacity-80" />

        <div className='flex mt-2 justify-center'>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="z-50 overflow-hidden rounded-md bg-white p-4 md:p-6 text-left shadow-xl w-11/12 md:w-1/3">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}