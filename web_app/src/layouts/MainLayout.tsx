import { Menu } from "@headlessui/react";
import clsx from "clsx";
import React, { useContext, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { User } from "../interfaces";

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

  const { authState: { user }, logout } = useContext(AuthContext);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <main className="grid grid-cols-12 h-screen">
      <section className="hidden md:block md:col-span-2 bg-gray-800">
        <h4 className='text-2xl text-gray-300 text-center py-4 font-bold'>PeñaVal</h4>
        <div className="flex flex-col">
          <NavItem icon={<i className="las la-clipboard la-lg" />} to="/products" title="Productos" />
          <NavItem icon={<i className="las la-donate la-lg" />} to="/sales" title="Ventas" />
          <NavItem icon={<i className="las la-shopping-cart la-lg" />} to="/shopping" title="Compras" />
          <NavItem icon={<i className="las la-memory la-lg" />} to="/brands" title="Marcas" />
          <NavItem icon={<i className="las la-map-pin la-lg" />} to="/places" title="Lugares" />
          <NavItem icon={<i className="las la-store-alt la-lg" />} to="/providers" title="Provedores" />
        </div>
      </section>
      <section className="col-span-12 md:col-span-10">
        <div className="flex flex-col">
          <header className="flex justify-between items-center border-b px-4 py-2">
            <div>
              <h4 className='md:hidden flex-1 text-2xl text-gray-700 font-bold'>PeñaVal</h4>
            </div>
            {user && <UserSection user={user} logout={logout} />}
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
    <Menu as="div" className="relative w-1/2 sm:w-1/3 md:w-1/4">
      <Menu.Button className="w-full border rounded-md hover:bg-gray-200 px-4 py-2 flex items-center">
        <div className="flex-1 flex gap-1">
          <i className="las la-user la-lg" />
          <span className="text-left text-sm font-medium">
            {user.person.firstName} {user.person.lastName}
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