import { useCallback, useEffect, useState } from "react";
import { Product } from "../interfaces";
import { getApiProducts } from "../services";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Spinner } from "../components/Spinner";
import { ProductItem } from "../components/ProductItem";

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const getProducts = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    const data = await getApiProducts(search, signal);
    setProducts(data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    getProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);


  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await getProducts();
  };

  return (
    <main className="flex flex-col md:mx-auto md:w-[500px] h-full">
      <header className="flex items-center px-4 md:p-0 gap-6 h-14">
        
        <div className="flex-initial">
          <Link to="/products/form" className="btn btn-primary p-2">
            Nuevo
          </Link>
        </div>

        <form className="flex-1 flex gap-2 items-center" onSubmit={onSubmit}>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Ej: Producto 'X'"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-initial">
            <Button type="submit" color="success">
              <i className="las la-search la-lg" />
            </Button>
          </div>
        </form>

      </header>

      <section className="overflow-auto flex-1 px-4 md:p-0">
        {!loading && products.map(p => (
          <Link to={`/products/detail?id=${p.id}`} key={p.id} className="border-b flex items-center py-2">
            <ProductItem product={p} />
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
