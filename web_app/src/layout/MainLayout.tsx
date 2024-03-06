import clsx from "clsx";
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import { Drawer } from "../components/Drawer";
import { useStore } from "../store";

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

  // const user: User = (window as any).user;

  const saleCart = useStore(state => state.saleCart);
  const shoppingCart = useStore(state => state.shoppingCart);

  useEffect(() => {

    const resize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', resize);


    return () => {
      window.removeEventListener('resize', resize);
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
    <main className="flex w-full" style={{ height: `${height}px` }}>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
        <header className="flex p-4 items-center">
          <h4 className='flex-1 text-2xl text-gray-300 font-bold'>PeñaVal</h4>
          <button className="w-8 h-8 flex justify-center items-center text-xl text-gray-200" onClick={logout}>
            <i className="las la-power-off la-lg" />
          </button>
        </header>
        <div className="flex flex-col">
          <NavItem icon={<i className="las la-clipboard la-lg" />} to="/products" title="Productos" />
          <NavItem icon={<i className="las la-memory la-lg" />} to="/brands" title="Marcas" />
          <NavItem icon={<i className="las la-map-pin la-lg" />} to="/places" title="Lugares" />
          <NavItem icon={<i className="las la-store-alt la-lg" />} to="/providers" title="Provedores" />
          <NavItem icon={<i className="las la-file-alt la-lg" />} to="/proform" title="Proformas" />
        </div>
      </Drawer>
      <section className="flex-1 h-full">
        <div className="flex flex-col">
          <header className="flex items-center border-b px-4 h-12">
            <div className="flex-1 flex items-center gap-2">
              <button className="outline-none text-lg mt-1" onClick={() => setIsOpen(true)}>
                <i className="las la-bars la-lg" />
              </button>
              <h4 className='text-2xl text-gray-700 font-bold'>PeñaVal</h4>
            </div>

            <div className="flex items-center gap-2">
              <section className="relative">
                <Link className={clsx("text-xl md:hover:bg-neutral-300 rounded-full p-1", window.location.pathname.includes('cart') ? "text-blue-600" : "text-neutral-800")} to="/cart">
                  <i className="las la-shopping-cart la-lg" />
                </Link>
                {(saleCart.length > 0 || shoppingCart.length > 0) && <span className="absolute -right-0.5 top-0 w-2.5 h-2.5 rounded-full bg-red-500"></span>}
              </section>
            </div>
          </header>
          <section className="md:py-2 md:px-4 h-[calc(100vh_-_3rem)]">
            {children}
          </section>
        </div>
      </section>
    </main>
  );
};


