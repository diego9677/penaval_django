import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { createApiProduct, deleteApiProduct, getApiBrands, getApiPlaces, getApiProduct, updateApiProduct } from "../services";
import { Brand, Place } from "../interfaces";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { BtnDeletaConfirmDialog } from "../components/common/BtnDeleteConfirmDialog";

interface StateData {
  code: string;
  measures: string;
  price: number;
  place_id: number | string;
  brand_id: number | string;
}

export const ProductForm = () => {
  const [data, setData] = useState<StateData>({ code: '', measures: '', price: 0, brand_id: '', place_id: '' });
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    if (id) {
      Promise.all([getApiProduct(Number(id), controller.signal), getApiBrands('', controller.signal), getApiPlaces('', controller.signal)])
        .then(([product, brands, places]) => {
          const { code, measures, price, place: { id: place_id }, brand: { id: brand_id } } = product;
          setData({
            code,
            measures,
            price: Number(price),
            brand_id,
            place_id,
          });
          setBrands(brands);
          setPlaces(places);
          setLoading(false);
        });
    } else {
      Promise.all([getApiBrands('', controller.signal), getApiPlaces('', controller.signal)])
        .then(([brands, places]) => {
          setBrands(brands);
          setPlaces(places);
          setLoading(false);
        });
    }

    return () => {
      controller.abort();
    };
  }, [id]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      await updateApiProduct(Number(id), data);
      navigate('/products', { replace: true });
    } else {
      await createApiProduct(data);
      navigate('/products', { replace: true });
    }
  };


  const onDelete = async (id: number) => {
    await deleteApiProduct(id);
    navigate('/products', { replace: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <main className="flex justify-center">
      <form className="w-full sm:w-1/2 flex flex-col gap-4 md:gap-6 p-4 md:p-0" onSubmit={onSubmit}>
        <header className="border-b flex py-2">
          <div className="w-8">
            <Link to={`/products/detail?id=${id}`} className="link">
              <i className="las la-arrow-left la-lg" />
            </Link>
          </div>
          <div className="flex-1 text-center">
            <h3 className="text-xl font-bold text-gray-700">
              {id ? 'Editar' : 'Nuevo'} Producto
            </h3>
          </div>
        </header>

        <section className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Codigo"
              type="text"
              placeholder="'XXX-XXX'"
              value={data.code}
              onChange={(e) => setData({ ...data, code: e.target.value })}
            />
          </div>

          <div className="flex-1">
            <Input
              label="Medidas"
              type="text"
              placeholder="'18x19x20'"
              value={data.measures}
              onChange={(e) => setData({ ...data, measures: e.target.value })}
            />
          </div>
        </section>

        <section className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Precio (Bs)"
              type="number"
              min={0}
              placeholder="'50.5'"
              value={data.price}
              onChange={(e) => setData({ ...data, price: Number(e.target.value) })}
            />
          </div>
          {/* <div className="flex-1">
            <Input
              label="Stock"
              type="number"
              min={0}
              placeholder="'50'"
              value={data.stock}
              onChange={(e) => setData({ ...data, stock: Number(e.target.value) })}
            />
          </div> */}
        </section>

        <section className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Select
              label="Marca"
              options={brands.map(b => ({ label: b.name, value: b.id }))}
              value={data.brand_id}
              onChange={(value) => setData({ ...data, brand_id: Number(value) })}
            />
          </div>

          <div className="flex-1">
            <Select
              label="Lugar"
              options={places.map(p => ({ label: p.name, value: p.id }))}
              value={data.place_id}
              onChange={(value) => setData({ ...data, place_id: Number(value) })}
            />
          </div>
        </section>

        <div className="flex gap-2">
          {id && (
            <div className="flex-1">
              <BtnDeletaConfirmDialog
                title="Eliminar"
                subtitle={`¿Esta seguro que desea eliminar el producto ${data.code}?`}
                onConfirm={() => onDelete(Number(id))}
              />
            </div>
          )}

          <div className="flex-1">
            <Button
              type="submit"
              color="primary"
            >
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
};
