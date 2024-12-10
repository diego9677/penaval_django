import clsx from "clsx";
import React, { useState } from 'react';

type Props = {
  id?: string;
  name?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string | number | readonly string[];
  color?: 'primary' | 'danger' | 'success';
  step?: number;
  min?: number;
  type: React.HTMLInputTypeAttribute;
};

const COLORS = {
  'primary': 'focus:ring-blue-600',
  'danger': 'focus:ring-red-600',
  'success': 'focus:ring-green-600'
};

export const Input = ({ id, label, name, error, step, min, placeholder, color = 'primary', type, value, onChange }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <section className="flex flex-col gap-1 h-full">
      {label &&
        <label htmlFor={id} className="text-sm text-gray-700 font-medium">{label}</label>
      }
      <div className="relative flex items-center h-full">
        <input
          className={clsx('h-full shadow-sm rounded-sm placeholder:text-gray-400 w-full text-sm font-normal text-gray-800 outline-none ring-1 ring-gray-300 focus:ring-2', COLORS[color])}
          type={type === 'password' && show ? 'text' : type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          step={step}
          min={min}
          name={name}
        />
        {type === 'password' &&
          <span className="absolute right-2 cursor-pointer p-1 rounded-full" onClick={() => setShow(!show)}>
            {show ? <i className="las la-eye-slash la-lg" /> : <i className="las la-eye la-lg" />}
          </span>
        }
      </div>
      {error && <span className="text-sm font-light text-red-600">{error}</span>}
    </section>
  );
};
