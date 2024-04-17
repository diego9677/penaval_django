import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createApiBrand, deleteApiBrand, getApiBrand, updateApiBrand } from "../services";
import { Input } from "../components/common/Input";
import { TextArea } from "../components/common/TextArea";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/common/Button";
import { BtnDeletaConfirmDialog } from "../components/common/BtnDeleteConfirmDialog";

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

  const onDelete = async (id: number) => {
    await deleteApiBrand(id);
    navigate('/brands', { replace: true });
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
            <Link to="/brands" className="link">
              <i className="las la-arrow-left la-lg" />
            </Link>
          </div>
          <div className="flex-1 text-center">
            <h3 className="text-xl font-bold text-gray-700">
              {id ? 'Editar' : 'Nueva'} Marca
            </h3>
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

        <div className="flex gap-2">
          {id && (
            <div className="flex-1">
              <BtnDeletaConfirmDialog
                title="Eliminar"
                subtitle={`¿Esta seguro que desea eliminar la marca ${data.name}?`}
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
