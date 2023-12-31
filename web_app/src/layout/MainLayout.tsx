/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu } from "@headlessui/react";
import clsx from "clsx";
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import { User } from "../interfaces";
import { Drawer } from "../components/Drawer";

type Props = {
  title: string;
  children: React.ReactNode;
};

const NavItem = ({ to, title, icon }: { to: string; title: string; icon: React.ReactNode; }) => {
  return (
    <NavLink to={to}
      className={({ isActive }) => clsx('outline-none p-4 cursor-pointer', isActive ? 'bg-blue-600' : 'hover:bg-gray-700')}
    >
      <div className="flex gap-2 items-center text-gray-100">
        {icon}
        <span className="text-sm font-medium">
          {title}
        </span>
      </div>
    </NavLink>
  );
};

export const MainLayout = ({ title, children }: Props) => {
  const [height, setHeight] = useState(window.innerHeight);
  const [isOpen, setIsOpen] = useState(false);

  const user: User = (window as any).user;

  useEffect(() => {

    const resizeHeight = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', resizeHeight);


    return () => {
      window.removeEventListener('resize', resizeHeight);
    };
  }, []);

  useEffect(() => {
    document.title = title;
  }, [title]);

  const logout = () => {
    window.location.href = '/accounts/logout/';
    console.log('logout');
  };

  return (
    <main className="flex" style={{ height: `${height}px` }}>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
        <h4 className='text-2xl text-gray-300 text-center py-4 font-bold'>PeñaVal</h4>
        <div className="flex flex-col">
          <NavItem icon={<i className="las la-clipboard la-lg" />} to="/products" title="Productos" />
          {/* <NavItem icon={<i className="las la-donate la-lg" />} to="/sales" title="Ventas" />
          <NavItem icon={<i className="las la-shopping-cart la-lg" />} to="/shopping" title="Compras" /> */}
          <NavItem icon={<i className="las la-memory la-lg" />} to="/brands" title="Marcas" />
          <NavItem icon={<i className="las la-map-pin la-lg" />} to="/places" title="Lugares" />
          <NavItem icon={<i className="las la-store-alt la-lg" />} to="/providers" title="Provedores" />
        </div>
      </Drawer>
      <section className="flex-1">
        <div className="flex flex-col">
          <header className="flex justify-between items-center border-b px-4 py-2">
            <div className="flex gap-2 items-end">
              <button className="outline-none" onClick={() => setIsOpen(true)}>
                <i className="las la-bars la-lg" />
              </button>
              <h4 className='text-2xl text-gray-700 font-bold'>PeñaVal</h4>
            </div>

            <div className="flex items-center gap-2 divide-x divide-dashed">
              <section className="relative">
                <Link className="text-lg md:hover:bg-neutral-300 rounded-full p-1" to="/cart">
                  <i className="las la-shopping-cart la-lg" />
                </Link>
                {/* <span className="absolute -right-0.5 top-0 w-2.5 h-2.5 rounded-full bg-red-500"></span> */}
              </section>

              <div className="pl-2">
                {user && <UserSection user={user} logout={logout} />}
              </div>
            </div>
          </header>
          <section className="md:py-2 md:px-4 h-[calc(100vh_-_3.5rem)]">
            {children}
          </section>
        </div>
      </section>
    </main>
  );
};


const UserSection = ({ user, logout }: { user: User, logout: () => void; }) => {
  return (
    <Menu as="div" className="relative w-1/2 md:w-1/6">
      <Menu.Button className="border rounded-md hover:bg-gray-200 px-4 py-2 flex items-center">
        <div className="flex-1 flex gap-1">
          <i className="las la-user la-lg" />
          <span className="text-left text-sm font-medium">
            {user.email}
          </span>
        </div>
        <i className="las la-angle-down la-lg" />
      </Menu.Button>
      <Menu.Items className="mt-1 bg-white absolute border rounded-md w-full z-10">
        <Menu.Item>
          <button
            type="button"
            className="text-sm font-normal py-2 px-4 flex gap-1 items-center hover:bg-gray-200 w-full"
            onClick={() => logout()}
          >
            <i className="las la-sign-out-alt la-lg" />
            <span>
              Cerrar Sesión
            </span>
          </button>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

