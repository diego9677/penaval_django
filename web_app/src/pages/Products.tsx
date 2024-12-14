import { useEffect, useState } from "react";
import { Place, Product } from "../interfaces";
import { getApiPlaces, getApiProducts } from "../services";
import { Link } from "react-router-dom";
import { Input } from "../components/common/Input";
import { Spinner } from "../components/Spinner";
import { ProductItem } from "../components/ProductItem";
import clsx from "clsx";

export const Products = () => {
  const [tab, setTab] = useState<number>(0);
  const [filters, setFilters] = useState({ word: '', internal: '', external: '', height: '' });
  const [products, setProducts] = useState<Product[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      getApiProducts('', controller.signal),
      getApiPlaces('', controller.signal)
    ])
      .then(([products, places]) => {
        setProducts(products);
        setPlaces(places);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  const onChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filterList = () => products.filter(p => tab === 0 ? true : p.place.id === tab).filter(p => {
    const [internal, external, height] = p.measures.split('x');
    const criter = `${p.brand} ${p.code}`.toLowerCase()
    const filter = filters.word.toLowerCase();

    return ((filters.internal === '' || internal === filters.internal) &&
      (filters.external === '' || external === filters.external) &&
      (filters.height === '' || height === filters.height)) && criter.includes(filter);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <main className="flex flex-col md:mx-auto md:w-[500px] h-full relative">
      <header className="flex flex-col px-4 md:p-0 h-44 justify-evenly">
        <div className="h-8">
            <Input
              type="text"
              placeholder="Buscar codigo, marca..."
              name="word"
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
          </div>

        <div className="overflow-auto pb-2 flex">
          <section className="flex-1 flex divide-x border rounded-l-lg rounded-r-lg">

            <button className={clsx("flex-1 p-2 flex items-center gap-1 hover:bg-gray-100 hover:rounded-l-lg", tab === 0 && "bg-gray-100")} onClick={() => setTab(0)}>
              <span className="py-1 px-2 rounded-lg bg-gray-900">
                <p className="text-white text-xs font-bold">{products.length}</p>
              </span>
              <p className={clsx("flex-1 font-semibold text-xs", tab === 0 ? "text-black" : "text-gray-500")}>Todos</p>
            </button>

            {places.map((p, i) => (
              <button
                key={p.id}
                className={clsx("flex-1 p-2 flex items-center gap-1 hover:bg-gray-100", tab === p.id && "bg-gray-100", i === places.length - 1 && "hover:rounded-r-lg")}
                onClick={() => {
                  setTab(p.id);
                }}
              >
                <span className="py-1 px-2 rounded-lg bg-gray-900">
                  <p className="text-white text-xs font-bold">{p.products_count}</p>
                </span>
                <div className="flex-1 flex items-start flex-col">
                  <p className={clsx("text-xs font-semibold whitespace-nowrap line-clamp-1", tab === p.id ? "text-black" : "text-gray-500")}>{p.name}</p>
                  <p className={clsx("text-xs font-light whitespace-nowrap line-clamp-1", tab === p.id ? "text-gray-600" : "text-gray-400")}>{p.description}</p>
                </div>
              </button>
            ))}
          </section>
        </div>

        <section className="flex gap-2 items-center">
          <div className="flex-1 h-8">
            <Input
              type="text"
              placeholder="Interno"
              name="internal"
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
          </div>

          <div className="flex-1 h-8">
            <Input
              type="text"
              placeholder="Externo"
              name="external"
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
          </div>

          <div className="flex-1 h-8">
            <Input
              type="text"
              placeholder="Altura"
              name="height"
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
          </div>
        </section>

      </header>

      <section className="overflow-auto flex-1 px-4 md:p-0">
        {filterList().map(p => (
          <Link to={`/products/detail?id=${p.id}`} key={p.id} className="border-b flex items-center py-2" style={{ contentVisibility: 'auto' }}>
            <ProductItem product={p} />
          </Link>
        ))}
      </section>

      <div className="absolute bottom-5 right-5">
        <Link to="/products/form">
          <div className="h-10 w-10 bg-blue-600 rounded-full flex justify-center items-center text-white">
            <i className="las la-plus la-lg" />
          </div>
        </Link>
      </div>
    </main>
  );
};
