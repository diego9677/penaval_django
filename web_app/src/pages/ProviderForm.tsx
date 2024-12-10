import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { createApiProvide, deleteApiProvider, getApiProvider, updateApiProvider } from "../services";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { BtnDeletaConfirmDialog } from "../components/common/BtnDeleteConfirmDialog";

interface StateData {
  name: string;
  address: string;
}

export const ProviderForm = () => {
  const [data, setData] = useState<StateData>({ name: '', address: '' });
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    if (id) {
      getApiProvider(Number(id), controller.signal)
        .then((data) => {
          setData({ name: data.name, address: data.address });
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      await updateApiProvider(Number(id), data);
      navigate('/providers', { replace: true });
    } else {
      await createApiProvide(data);
      navigate('/providers', { replace: true });
    }
  };

  const onDelete = async (id: number) => {
    await deleteApiProvider(id);
    navigate('/providers', { replace: true });
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
            <Link to="/providers" className="link">
              <i className="las la-arrow-left la-lg" />
            </Link>
          </div>
          <div className="flex-1 text-center">
            <h3 className="text-xl font-bold text-gray-700">
              {id ? 'Editar' : 'Nuevo'} Proveedor
            </h3>
          </div>
        </header>

        <div className="h-14">
          <Input
            label="Nombre"
            type="text"
            placeholder="'Mundo Repuesto'"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </div>

        <div className="h-14">
          <Input
            label="Dirección"
            type="text"
            placeholder="'Av. Siempre Viva'"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
        </div>

        <div className="flex gap-2 h-8">
          {id && (
            <div className="flex-1">
              <BtnDeletaConfirmDialog
                title="Eliminar"
                subtitle={`¿Esta seguro que desea eliminar el provedor ${data.name}?`}
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
