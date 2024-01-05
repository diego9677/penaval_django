import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type DrawerProps = {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    children: React.ReactNode;
};

export const Drawer = ({ isOpen, setIsOpen, children }: DrawerProps) => {

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
                <Dialog.Overlay className="z-40 fixed inset-0 bg-black opacity-30" />

                <div className="flex md:w-[400px] w-3/4 h-full">
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <div className="h-full bg-neutral-900 z-50 w-full">
                            {children}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};