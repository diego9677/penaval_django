import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

type DrawerProps = {
  children: React.ReactNode;
};

export const SidebarDrawer = ({ children }: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <Transition
        show={isOpen}
        as={Fragment}
      >
        <Dialog
          unmount={false}
          onClose={() => setIsOpen(false)}
          className="fixed z-30 inset-0 overflow-hidden h-full"
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-in duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-30"
            entered="opacity-30"
            leave="transition-opacity ease-out duration-100"
            leaveFrom="opacity-30"
            leaveTo="opacity-5"
  
          >
            <Dialog.Overlay className="z-40 fixed inset-0 bg-black" />
          </Transition.Child>
  
          <div className="flex absolute w-[450px] right-0">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-1"
              leave="transition ease-in-out duration-200 transform"
              leaveFrom="translate-x-1"
              leaveTo="translate-x-full"
            >
              <div
                className="flex flex-col divide-y bg-white z-50 w-full">
                {children}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };