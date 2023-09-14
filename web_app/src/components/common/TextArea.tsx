import clsx from "clsx";
import React from 'react';

type Props = {
  id?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  value?: string | number | readonly string[];
  color?: 'primary' | 'danger' | 'success';
};

const COLORS = {
  'primary': 'focus:ring-blue-600',
  'danger': 'focus:ring-red-600',
  'success': 'focus:ring-green-600'
};

export const TextArea = ({ id, label, error, placeholder, color = 'primary', value, onChange }: Props) => {


  return (
    <section className="flex flex-col gap-1">
      {label &&
        <label htmlFor={id} className="text-sm text-gray-700 font-medium">{label}</label>
      }
      <textarea
        className={clsx('p-2 shadow-sm rounded-sm placeholder:text-gray-400 w-full text-sm font-normal text-gray-800 outline-none ring-1 ring-gray-300 focus:ring-2', COLORS[color])}
        rows={3}
        cols={10}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      ></textarea>
      {error && <span className="text-sm font-light text-red-600">{error}</span>}
    </section>
  );
};
