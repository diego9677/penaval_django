import { useCallback, useEffect, useState } from "react";
import { Product } from "../interfaces";
import { getApiProducts } from "../services";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Spinner } from "../components/Spinner";
import { ProductItem } from "../components/ProductItem";

// const COLUMNS = [
//   '#',
//   'Marca',
//   'Código',
//   'Medidas',
//   'Ubicación',
//   'Catidad',
//   'Precio',
//   ''
// ];


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
    <main className="flex flex-col md:gap-8 md:mx-auto md:w-[500px]">
      <header className="flex justify-between items-center py-2 px-4 md:p-0">

        <div className="w-20">
          <Link to="/products/form" className="btn btn-primary p-2">
            Nuevo
          </Link>
        </div>

        <form className="flex gap-2 items-center" onSubmit={onSubmit}>
          <Input
            type="text"
            placeholder="Ej: Producto 'X'"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="w-10">
            <Button type="submit" color="success">
              <i className="las la-search la-lg" />
            </Button>
          </div>
        </form>
      </header>

      <section className="overflow-auto h-[calc(100vh_-_7.5rem)] md:h-[calc(100vh_-_9rem)] py-2 px-4 md:p-0">
        {!loading && products.map(p => (
          <Link to={`/products/detail?id=${p.id}`} key={p.id} className="border-b flex gap-7 items-center py-2">
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


// {!loading && (
//   <>
//     <div className="hidden md:block">
//       <TableBuilder
//         columns={COLUMNS}
//         children={products.map((b) => {
//           return (
//             <tr key={b.id} className="text-left text-sm font-normal text-gray-900">
//               <td className="p-2">{b.id}</td>
//               <td className="p-2">{b.brand.name}</td>
//               <td className="p-2">{b.code}</td>
//               <td className="p-2">{b.measures}</td>
//               <td className="p-2">{b.place.name}</td>
//               <td className="p-2">
//                 <div className={clsx('w-10 py-1 text-center font-medium border rounded-md', b.stock > 0 ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600')}>
//                   {b.stock}
//                 </div>
//               </td>
//               <td className="p-2">{b.price} Bs</td>
//               <td className="flex gap-2 items-center justify-center h-12">
//                 <div className="w-8">
//                   <Link to={`/products/form?id=${b.id}`}>
//                     <Button type="button" color="success" size="xs">
//                       <i className="las la-pen la-lg" />
//                     </Button>
//                   </Link>
//                 </div>
//                 <div className="w-8">
//                   <BtnDeletaConfirmDialog
//                     title="Eliminar"
//                     subtitle={`¿Esta seguro que desea eliminar el producto ${b.code}?`}
//                     onConfirm={() => onDelete(b.id)}
//                   />
//                 </div>
//               </td>
//             </tr>
//           );
//         })}
//       />
//     </div>
//     <div className="block md:hidden">
//     </div>
//   </>
// )}