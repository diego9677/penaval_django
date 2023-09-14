import clsx from "clsx";
import React from "react";

type Props = {
  type: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  color?: 'primary' | 'danger' | 'success' | 'secondary';
  size?: 'xs' | 'md';
};

const SIZES = {
  'xs': 'p-1',
  'md': 'p-2'
};

const COLORS = {
  'primary': 'bg-blue-600 ring-blue-600 hover:bg-opacity-80',
  'secondary': 'border-gray-300 text-gray-600 hover:border-blue-100 hover:bg-blue-100 hover:text-blue-900',
  'danger': 'bg-red-600 ring-red-600 hover:bg-opacity-80',
  'success': 'bg-green-600 ring-green-600 hover:bg-opacity-80'
};

export const Button = ({ type, size = 'md', color = 'primary', onClick, children }: Props) => {
  return (
    <button
      className={clsx('w-full ring-1 outline-none rounded-sm shadow-sm text-sm font-medium text-gray-100', SIZES[size], COLORS[color])}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
