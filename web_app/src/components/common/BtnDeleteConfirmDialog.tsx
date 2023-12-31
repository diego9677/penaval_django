import { useState } from 'react';
import { Dialog } from "@headlessui/react";
import { Button } from "./Button";
import { CustomDialog } from "../CustomDialog";

type Props = {
  title: string;
  subtitle: string;
  onConfirm: () => void;
};

export const BtnDeletaConfirmDialog = ({ title, subtitle, onConfirm }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <Button
        type="button"
        onClick={openModal}
        color="danger"
        size="md"
      >
        <i className="las la-trash-alt la-lg" />
        {title}
      </Button>


      <CustomDialog dialog={isOpen} closeDialog={closeModal} size="xl">
        <Dialog.Title
          as="h3"
          className="text-xl font-semibold leading-6 text-gray-700"
        >
          {title}
        </Dialog.Title>
        <div className="mt-2">
          <p className="text-lg text-gray-700 font-normal">
            {subtitle}
          </p>
        </div>

        <div className="mt-4 w-32">
          <Button
            type="button"
            color="danger"
            onClick={() => {
              onConfirm();
              closeModal();
            }}
          >
            Si, eliminar
          </Button>
        </div>
      </CustomDialog>
    </>
  );
};
