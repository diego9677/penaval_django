import React from "react";

type Props = {
  type: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  color?: 'primary' | 'danger' | 'success' | 'secondary';
  size?: 'xs' | 'md';
};


const COLORS = {
  'primary': 'btn btn-primary',
  'secondary': 'btn btn-secondary',
  'danger': 'btn btn-danger',
  'success': 'btn btn-success'
};

export const Button = ({ type, color = 'primary', onClick, children }: Props) => {
  return (
    <button
      className={COLORS[color]}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
