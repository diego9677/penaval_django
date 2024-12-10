import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { createApiPlace, deleteApiPlace, getApiPlace, updateApiPlace } from "../services";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { TextArea } from "../components/common/TextArea";
import { BtnDeletaConfirmDialog } from "../components/common/BtnDeleteConfirmDialog";

interface StateData {
  name: string;
  description?: string;
}

export const PlaceForm = () => {
  const [data, setData] = useState<StateData>({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    if (id) {
      getApiPlace(Number(id), controller.signal)
        .then((data) => {
          setData({ name: data.name, description: data.description });
        }).finally(() => setLoading(false));
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
      await updateApiPlace(Number(id), data);
      navigate('/places', { replace: true });
    } else {
      await createApiPlace(data);
      navigate('/places', { replace: true });
    }
  };

  const onDelete = async (id: number) => {
    await deleteApiPlace(id);
    navigate('/places', { replace: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <main className="flex justify-center h-full">
      <form className="w-full sm:w-1/2 flex flex-col gap-4 md:gap-6 p-4 md:p-0" onSubmit={onSubmit}>
        <header className="border-b flex py-2">
          <div className="w-8">
            <Link to="/places" className="link">
              <i className="las la-arrow-left la-lg" />
            </Link>
          </div>
          <div className="flex-1 text-center">
            <h3 className="text-xl font-bold text-gray-700">
              {id ? 'Editar' : 'Nuevo'} Lugar
            </h3>
          </div>
        </header>

        <div className="h-14">
          <Input
            label="Nombre"
            type="text"
            placeholder="'Bloque 1'"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </div>

        <TextArea
          label="Descripción"
          placeholder="'Sección conicos'"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />

        <div className="flex gap-2 h-8">
          {id && (
            <div className="flex-1">
              <BtnDeletaConfirmDialog
                title="Eliminar"
                subtitle={`¿Esta seguro que desea eliminar el lugar ${data.name}?`}
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
