import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TypeProduct } from "../interfaces";
import { getApiTypeProducts } from "../services";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Spinner } from "../components/Spinner";


export const TypeProducts = () => {
  const [typeProducts, setTypeProducts] = useState<TypeProduct[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    getTypes(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);


  const getTypes = async (signal?: AbortSignal) => {
    setLoading(true);
    const data = await getApiTypeProducts(search, signal);
    setTypeProducts(data);
    setLoading(false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await getTypes();
  };

  return (
    <main className="flex flex-col md:mx-auto md:w-[500px] h-full">
      <header className="flex items-center px-4 md:p-0 gap-6 h-14">

        <div className="flex-initial h-8 w-14">
          <Link to="/brands/form">
            <Button type="button">Nuevo</Button>
          </Link>
        </div>

        <form className="flex-1 flex gap-2 items-center" onSubmit={onSubmit}>
          <div className="flex-1 h-8">
            <Input
              type="text"
              placeholder="Buscar Tipo de productos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-initial h-8 w-8">
            <Button type="submit" color="success">
              <i className="las la-search la-lg" />
            </Button>
          </div>
        </form>
        
      </header>

      <section className="overflow-auto flex-1 px-4 md:p-0">
        {!loading && typeProducts.map(b => (
          <Link to={`/type-products/form?id=${b.id}`} className="flex flex-col gap-1 border-b py-2" key={b.id}>
            <span className="text-sm font-semibold text-gray-800">{b.name}</span>
            <span className="text-sm font-light text-gray-700">{b.description}</span>
          </Link>
        ))}

        {loading &&
          <div className="flex justify-center items-center h-full">
            <Spinner color="primary" size="lg" />
          </div>
        }
      </section>
    </main>
  );
};
