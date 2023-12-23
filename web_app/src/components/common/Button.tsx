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
  'primary': 'btn btn-primary',
  'secondary': 'btn btn-secondary',
  'danger': 'btn btn-danger',
  'success': 'btn btn-success'
};

export const Button = ({ type, size = 'md', color = 'primary', onClick, children }: Props) => {
  return (
    <button
      className={clsx(SIZES[size], COLORS[color])}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
