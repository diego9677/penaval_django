import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { createApiProvide, getApiProvider, updateApiProvider } from "../services";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";

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
      navigate('/wa/providers', { replace: true });
    } else {
      await createApiProvide(data);
      navigate('/wa/providers', { replace: true });
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
            <Link to="/wa/providers">
              <Button type="button" color="danger" size="xs">
                <i className="las la-times la-lg" />
              </Button>
            </Link>
          </div>
        </header>

        <Input
          label="Nombre"
          type="text"
          placeholder="'Mundo Repuesto'"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <Input
          label="Dirección"
          type="text"
          placeholder="'Av. Siempre Viva'"
          value={data.address}
          onChange={(e) => setData({ ...data, address: e.target.value })}
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
