import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { createApiPlace, getApiPlace, updateApiPlace } from "../services";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { TextArea } from "../components/common/TextArea";

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
      navigate('/wa/places', { replace: true });
    } else {
      await createApiPlace(data);
      navigate('/wa/places', { replace: true });
    }
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
      <form className="w-full sm:w-1/2 flex flex-col gap-6" onSubmit={onSubmit}>
        <header className="border-b flex justify-between py-2">
          <h3 className="text-xl font-bold text-gray-700">
            {id ? 'Editar' : 'Nuevo'} Lugar
          </h3>
          <div className="w-8">
            <Link to="/wa/places">
              <Button type="button" color="danger" size="xs">
                <i className="las la-times la-lg" />
              </Button>
            </Link>
          </div>
        </header>

        <Input
          label="Nombre"
          type="text"
          placeholder="'Bloque 1'"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <TextArea
          label="Descripción"
          placeholder="'Sección conicos'"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />

        <Button
          type="submit"
          color="primary"
        >
          Guardar
        </Button>
      </form>
    </main>
  );
};
