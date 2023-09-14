import { Transition, Dialog } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, ReactNode } from 'react';

type Size = 'sm' | 'md' | 'lg' | 'default';

interface Props {
  dialog: boolean;
  closeDialog: () => void;
  size?: Size;
  children?: ReactNode;
}

const SIZES = {
  'lg': 'w-3/4',
  'md': 'w-1/2',
  'sm': 'w-1/3',
  'default': 'w-auto'
};


export function CustomDialog({ dialog, closeDialog, size = 'default', children }: Props) {
  return (
    <Transition appear show={dialog} as={Fragment}>
      <Dialog as='div' className='relative z-10' open={dialog} onClose={closeDialog}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className='fixed inset-0 bg-black bg-opacity-70' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={clsx(SIZES[size], 'transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all')}>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}