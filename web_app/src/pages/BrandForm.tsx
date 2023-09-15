import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createApiBrand, getApiBrand, updateApiBrand } from "../services";
import { Input } from "../components/common/Input";
import { TextArea } from "../components/common/TextArea";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/common/Button";

interface StateData {
  name: string;
  description?: string;
}

export const BrandForm = () => {
  const [data, setData] = useState<StateData>({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    if (id) {
      getApiBrand(Number(id), controller.signal)
        .then((data) => {
          setData({ name: data.name, description: data.description });
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
      await updateApiBrand(Number(id), data);
      navigate('/brands', { replace: true });
    } else {
      await createApiBrand(data);
      navigate('/brands', { replace: true });
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
            {id ? 'Editar' : 'Nueva'} Marca
          </h3>
          <div className="w-8">
            <Link to="/ws/brands">
              <Button type="button" color="danger" size="xs">
                <i className="las la-times la-lg" />
              </Button>
            </Link>
          </div>
        </header>

        <Input
          label="Nombre"
          type="text"
          placeholder="'SKF'"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <TextArea
          label="Descripción"
          placeholder="'Repuesto Japones'"
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
