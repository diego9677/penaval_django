import React, { useState, useEffect } from 'react';

import { createApiSale, getApiProducts, getClientByNit, getSale, setSale } from "../services";
import { Product, SaleCart } from "../interfaces";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { Spinner } from "../components/Spinner";
import { BtnSaleDialog } from "../components/BtnSaleDialog";
import { ProductItem } from "../components/ProductItem";
import { TableBuilder } from "../components/TableBuilder";
import { AxiosError } from "axios";

const COLUMNS = [
  'Código',
  'Catidad',
  'P. Venta',
  'Subtotal',
  ''
];

interface SaleState {
  nit: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export const SaleForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [saleCartState, setSaleCartState] = useState<SaleCart[]>(getSale());
  const [saleState, setSaleState] = useState<SaleState>({ nit: '', firstName: '', lastName: '', phone: '' });
  // loadings
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getProducts(controller.signal)
      .then(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setSale(saleCartState);
  }, [saleCartState]);


  const getProducts = async (signal?: AbortSignal) => {
    const data = await getApiProducts(search, signal);
    setProducts(data);
  };

  const onAddSaleCart = (shopping: SaleCart) => {
    setSaleCartState((prev) => {
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
    const newProducts = saleCartState.filter(p => p.productCode !== productCode);
    setSaleCartState(newProducts);
  };

  const setTotal = () => {
    const total = saleCartState.reduce((acc, el) => acc + (el.quantity * el.salePrice), 0);
    return total;
  };

  const onClean = () => {
    setSaleState({ nit: '', firstName: '', lastName: '', phone: '' });
    setSaleCartState([]);
  };

  const onSaveSale = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saleCartState.length === 0) {
      alert('No hay productos en el carrito');
      return;
    }

    if (saleState.nit === '' || saleState.firstName === '' || saleState.lastName === '' || saleState.phone === '') {
      alert('Debe proporcionar datos del cliente');
      return;
    }

    setSaveLoading(true);
    const data = { ...saleState, products: saleCartState };
    await createApiSale(data);
    await getProducts();
    onClean();
    setSaveLoading(false);
  };

  const onFindClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchLoading(true);
    try {
      const data = await getClientByNit(saleState.nit);
      if (data) {
        setSaleState({ nit: data.nit, firstName: data.person.firstName, lastName: data.person.lastName, phone: data.person.phone });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        setSaleState({ nit: saleState.nit, firstName: '', lastName: '', phone: '' });
      }
    }
    setSearchLoading(false);
  };

  const onSearchProduct = async (e: React.FormEvent<HTMLFormElement>) => {
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

          <form className="flex gap-1 items-center" onSubmit={onSearchProduct}>
            <Input type="text" placeholder="'Producto X'" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="w-10">
              <Button type="submit" color="success">
                <i className="las la-search la-lg" />
              </Button>
            </div>
          </form>
        </header>

        <ul className="overflow-auto h-[calc(100vh_-_8rem)]">
          {!loading && products.map(p => (
            <li key={p.id} className="px-4 py-2 border-b flex gap-10 items-center">
              <ProductItem product={p} />
              <div className="w-8">
                {p.stock > 0 &&
                  <BtnSaleDialog product={p} onConfirmDialog={onAddSaleCart} />
                }
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
        <h4 className="text-lg font-medium text-gray-800 px-4 py-2">Registrar Ventas</h4>
        <form className="flex items-end gap-1 px-4 w-1/2" onSubmit={onFindClient}>
          <section className="flex-1">
            <Input
              type="text"
              label="Nit"
              placeholder="'2123'"
              value={saleState.nit}
              onChange={(e) => setSaleState({ ...saleState, nit: e.target.value })}
            />
          </section>
          <section>
            <Button
              type="submit"
              color="success"
            // onClick={findClient}
            >
              {searchLoading ? <Spinner color="white" size="md" /> : <i className="las la-search la-lg" />}
            </Button>
          </section>
        </form>
        <form className="flex flex-col gap-5 px-4 py-2" onSubmit={onSaveSale}>
          <section className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                label="Nombres"
                placeholder="'Pepe'"
                value={saleState.firstName}
                onChange={(e) => setSaleState({ ...saleState, firstName: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <Input
                type="text"
                label="Apellidos"
                placeholder="'Perez'"
                value={saleState.lastName}
                onChange={(e) => setSaleState({ ...saleState, lastName: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <Input
                type="text"
                label="Telefono"
                placeholder="'7832362'"
                value={saleState.phone}
                onChange={(e) => setSaleState({ ...saleState, phone: e.target.value })}
              />
            </div>
          </section>

          <section className="overflow-auto h-[calc(100vh_-_21rem)]">
            {saleCartState.length > 0 ?
              <TableBuilder
                columns={COLUMNS}
                children={saleCartState.map((s) => {
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
