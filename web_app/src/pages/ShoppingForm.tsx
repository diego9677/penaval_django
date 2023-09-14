import { useState, useEffect } from 'react';

import { createApiShopping, getApiProducts, getApiProviders, getShopping, setShopping } from "../services";
import { Product, Provider, ShoppingCart } from "../interfaces";
import { Input } from "../components/common/Input";
import { ProductItem } from "../components/ProductItem";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/common/Button";
import { BtnShoppingDialog } from "../components/BtnShoppingDialog";
import { TableBuilder } from "../components/TableBuilder";
import { Select } from "../components/common/Select";

const COLUMNS = [
  'Código',
  'Catidad',
  'P. Compra',
  'P. Venta',
  'Subtotal',
  ''
];

export const ShoppingForm = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [shoppingCartState, setShoppingCartState] = useState<ShoppingCart[]>(getShopping());
  const [selectedProvider, setSelectedProvider] = useState<number | string>('');
  // loadings
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([getProducts(controller.signal), getProviders(controller.signal)])
      .then(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setShopping(shoppingCartState);
  }, [shoppingCartState]);


  const getProducts = async (signal?: AbortSignal) => {
    const data = await getApiProducts(search, signal);
    setProducts(data);
  };

  const getProviders = async (signal?: AbortSignal) => {
    const data = await getApiProviders(search, signal);
    setProviders(data);
  };

  const onAddShoppingCart = (shopping: ShoppingCart) => {

    setShoppingCartState((prev) => {
      const index = prev.findIndex(p => p.productCode === shopping.productCode);
      if (prev[index]) {
        prev[index] = shopping;
        return prev;
      } else {
        return [...prev, shopping];
      }
    });
  };


  const removeItem = (productCode: string) => {
    const newProducts = shoppingCartState.filter(p => p.productCode !== productCode);
    setShoppingCartState(newProducts);
  };

  const setTotal = () => {
    const total = shoppingCartState.reduce((acc, el) => acc + (el.quantity * el.pucharsePrice), 0);
    return total;
  };

  const onClean = () => {
    setSelectedProvider('');
    setShoppingCartState([]);
  };

  const onSaveShopping = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (shoppingCartState.length === 0) {
      alert('No hay productos en el carrito');
      return;
    }

    if (typeof selectedProvider === 'string') {
      alert('Debe seleccionar un proveedor');
      return;
    }

    setSaveLoading(true);
    const data = { providerId: selectedProvider, products: shoppingCartState };
    await createApiShopping(data);
    await getProducts();
    onClean();
    setSaveLoading(false);
  };

  const onSearchProducts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await getProducts();
    setLoading(false);
  };

  return (
    <main className="flex gap-5 h-full">
      <section className="flex-1 border shadow-md">
        <header className="border-b px-4 py-2 flex items-center justify-between">
          <h4 className="text-lg font-medium text-gray-800">Lista de productos</h4>

          <form className="flex gap-1 items-center" onSubmit={onSearchProducts}>
            <Input type="text" placeholder="'Producto X'" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="w-10">
              <Button type="submit" color="success">
                <i className="las la-search la-lg" />
              </Button>
            </div>
          </form>
        </header>

        <ul className="overflow-auto h-[calc(100vh_-_8.5rem)]">
          {!loading && products.map(p => (
            <li key={p.id} className="px-4 py-2 border-b flex gap-10 items-center">
              <ProductItem product={p} />
              <div className="w-8">
                <BtnShoppingDialog product={p} onConfirmDialog={onAddShoppingCart} />
              </div>
            </li>
          ))}
          {loading &&
            <div className="flex justify-center items-center h-full">
              <Spinner color="primary" size="lg" />
            </div>
          }
        </ul>
      </section>

      <section className="flex-1 border shadow-md">
        <h4 className="text-lg font-medium text-gray-800 px-4 py-2">Registrar Compra</h4>
        <form className="flex flex-col gap-5 px-4 py-2" onSubmit={onSaveShopping}>

          <section className="">
            <Select
              id="id-provider"
              label="Proveedor"
              options={providers.map(p => ({ label: p.name, value: p.id }))}
              value={selectedProvider}
              onChange={(value) => setSelectedProvider(value)}
            />
          </section>

          <section className="overflow-auto h-[calc(100vh_-_18rem)]">
            {shoppingCartState.length > 0 ?
              <TableBuilder
                columns={COLUMNS}
                children={shoppingCartState.map((s) => {
                  return (
                    <tr key={s.productCode} className="text-left text-sm font-normal text-gray-900">
                      <td className="p-2">{s.productCode}</td>
                      <td className="p-2">{s.quantity}</td>
                      <td className="p-2">{s.salePrice} Bs</td>
                      <td className="p-2">{Math.round((s.quantity * s.salePrice) * 10) / 10} Bs</td>
                      <td className="p-2">
                        <div className="w-10">
                          <Button
                            type="button"
                            color="danger"
                            size="xs"
                            onClick={() => removeItem(s.productCode)}
                          >
                            <i className="las la-trash-alt la-lg" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                footer={
                  <>
                    <td className="p-2 uppercase" colSpan={3}>
                      Total:
                    </td>
                    <td className="p-2" colSpan={2}>
                      {setTotal()} Bs
                    </td>
                  </>
                }
              />
              :
              <div className="flex h-28 bg-gray-200 justify-center items-center rounded-md">
                <p className="text-gray-800 font-medium text-lg">
                  No hay información util
                </p>
              </div>
            }
          </section>

          <section className="flex gap-4">
            <div className="flex-1">
              <Button type="button" color="danger" onClick={onClean}>Limpiar</Button>
            </div>
            <div className="flex-1">
              <Button type="submit" color="primary">
                {saveLoading ? <Spinner color="white" size="md" /> : 'Guardar'}
              </Button>
            </div>
          </section>
        </form>
      </section>
    </main>
  );
};
