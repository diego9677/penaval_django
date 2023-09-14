import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import clsx from "clsx";

interface Item {
  label: string;
  value: string | number;
}

type Props = {
  id?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string | number | readonly string[];
  color?: 'primary' | 'danger' | 'success';
  options: Item[];
  onChange: (value: string | number) => void;
};


export const Select = ({ id, label, options, value, onChange }: Props) => {
  const [selected, setSelected] = useState<Item | string>('');

  useEffect(() => {
    setSelected(options.find((o) => o.value === value) || '');
  }, [value, options]);

  const handleChange = (item: Item) => {
    setSelected(item);
    onChange(item.value);
  };

  return (
    <section className="flex flex-col gap-1">
      {label &&
        <label htmlFor={id} className="text-sm text-gray-700 font-medium">{label}</label>
      }
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full flex items-center justify-between p-2 text-left outline-none ring-1 ring-gray-300 rounded-sm">
            <p className="block truncate text-sm font-normal text-gray-800">{typeof selected !== 'string' ? selected.label : '--------'}</p>
            <i className="las la-angle-down la-lg" />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-sm bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((o, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active, selected }) => clsx('relative cursor-default select-none p-2', active || selected ? 'bg-blue-100 text-blue-900' : 'text-gray-900')}
                  value={o}
                >
                  {({ selected }) => (
                    <span
                      className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}
                    >
                      {o.label}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </section>
  );
};
